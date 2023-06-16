const pool = require('../connection/database');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncError = require('../middleware/catchAsyncError')
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');


// todo: create a project -- seller controller
const createProject =  catchAsyncError (async(req, res, next) => {
    
    try {

        const {heading, category, subcategory, description, tags, types, quote, price, serviceone, servicetwo, servicethree, servicefour, deliverydays, revisions} = req.body;
        
        const userid = req.user.userid;
        const suserid = req.user.suserid;
        
        // get the image
        const images = req.files.images; 
        
        const filenames = [];
        for (const image of images) {
            // ? Rename the file
            const filename = uuidv4() + Date.now() + '_' + image.name; // ? add current timestamp to the filename
            // ? save the Rename file
            image.mv(`./server/storage/images/${filename}`, (error) => {
              if (error) {
                console.error(error);
                throw new Error('Error saving file');
              }
            });
            filenames.push(filename);
        }
        // ENDS

        // CREATE SLUG
        const timestamp = new Date().toISOString();
        const slug = `${slugify(heading, { lower: true, strict: true })}-${userid}-${timestamp}`;
        // ENDS

        const connection = await pool.getConnection();


        // Check the user's status
        const [userStatus] = await connection.execute('SELECT status FROM accountinfo WHERE userid = ?', [userid]);
        if (userStatus.length && userStatus[0].status === 'pending') {
            return res.status(400).json({ success: false, message: 'You cannot create a project until your account is approved' });
        }



        const [projectCount] = await connection.execute('SELECT COUNT(*) as count FROM project WHERE userid = ?', [userid]);
        const numOfProjects = projectCount[0].count;
        if(numOfProjects >=10){
            return res.status(400).json({success: false, message: "You have reached maximum number of projects"})
        }


        const [project] = await connection.execute('INSERT INTO project (userid, suserid, heading, category, subcategory, description, tags, images, slug) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [userid, suserid, heading, JSON.stringify(category), JSON.stringify(subcategory), description, JSON.stringify(tags), JSON.stringify(filenames)], slug);


        console.log(`Project created successfully`);

        const projectid = project.insertId;

        // Insert types into database
        for (const type of types) {

            const { type: typeName, quote, price, serviceone, servicetwo,servicethree, servicefour, deliverydays, revisions} = type;
            
            await connection.execute('INSERT INTO projecttype (userid, suserid, projectid, type, quote, price, serviceone, servicetwo, servicethree, servicefour, deliverydays, revisions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [userid, suserid, projectid, typeName, quote, price, serviceone, servicetwo, servicethree, servicefour, deliverydays, revisions]);

        }

        console.log(`Project_type created successfully`);


        const createdProject = {
            id: project.insertId,
            userid: userid, 
            suserid: suserid, 
            heading: heading,
            category: category, 
            subcategory: subcategory,
            description: description,
            tags: tags,
            images: filenames
        }


        res.status(201).json({
            success: true,
            message: 'Project is created',
            project: createdProject
        })


        connection.release();

    } catch (error) {
        console.log('Error in creating project: ', error);
        return next(new ErrorHandler('Internal server error', 500));
    }

});



// todo: get all projects -- buyer controller
const getProjects = catchAsyncError(async(req, res, next) => {


    try {
        const connection = await pool.getConnection();

        const [rows] = await connection.execute(`
          SELECT p.projectid, p.userid, p.suserid, u.username, p.heading, p.slug, p.category, p.subcategory, p.description, p.tags, p.images, pt.projecttypeid, pt.type, pt.quote, pt.price, pt.serviceone, pt.servicetwo, pt.servicethree, pt.servicefour, pt.deliverydays, pt.revisions, av.profilephoto,
          COUNT(DISTINCT o.order_id) AS order_count, 
          AVG(o.reviews) AS review_average
          FROM project p
          JOIN projecttype pt ON p.projectid = pt.projectid
          JOIN user u ON p.userid = u.userid
          JOIN avatar av ON p.userid = av.userid
          LEFT JOIN orders o ON p.projectid = o.projectid
          WHERE p.projectid IN (
            SELECT projectid
            FROM (
              SELECT projectid, category, ROW_NUMBER() OVER (PARTITION BY category ORDER BY createdAt DESC) AS row_num
              FROM project
            ) subquery
            WHERE row_num <= 8
          )
          GROUP BY p.projectid, pt.projecttypeid
        `);
      
        const projects = new Map();

        for (const row of rows) {
          const projectId = row.projectid;
          let project = projects.get(projectId);
      
          if (!project) {
            project = {
              id: projectId,
              userid: row.userid,
              suserid: row.suserid,
              username: row.username,
              profilephoto: { link: `/profileImages/${row.profilephoto}` },
              heading: row.heading,
              slug: row.slug,
              category: row.category,
              subcategory: row.subcategory,
              description: row.description,
              tags: row.tags,
              images: [],
              reviews: row.review_average || 0,
              orders: row.order_count || 0,
              types: [],
            };
      
            projects.set(projectId, project);
          }
      
          // Get images
          const filenames = row.images ? JSON.parse(row.images) : [];
          const imageUrls = filenames.map((filename) => ({ link: `/images/${filename}` }));
          project.images = imageUrls;
          // End get images
      
          const type = {
            id: row.projecttypeid,
            type: row.type,
            quote: row.quote,
            price: row.price,
            serviceone: row.serviceone,
            servicetwo: row.servicetwo,
            servicethree: row.servicethree,
            servicefour: row.servicefour,
            deliverydays: row.deliverydays,
            revisions: row.revisions,
          };
      
          project.types.push(type);
        }
      
        res.status(200).json({
          success: true,
          message: "Projects retrieved successfully",
          projects: Array.from(projects.values()),
        });

        
    } catch (error) {
        console.log('Error in retrieving projects: ', error);
        return next(new ErrorHandler('Internal server error', 500));
    }

})


// todo: get projects with pagination-- buyer controller
// const getProjects = catchAsyncError(async(req, res, next) => {


//   try {
//       const connection = await pool.getConnection();

//       const [rows] = await connection.execute(`
//         SELECT p.projectid, p.userid, p.suserid, u.username, p.heading, p.category, p.subcategory, p.description, p.tags, p.images, pt.projecttypeid, pt.type, pt.quote, pt.price, pt.serviceone, pt.servicetwo, pt.servicethree, pt.servicefour, pt.deliverydays, pt.revisions, av.profilephoto,
//         COUNT(DISTINCT o.order_id) AS order_count, 
//         AVG(o.reviews) AS review_average
//         FROM project p
//         JOIN projecttype pt ON p.projectid = pt.projectid
//         JOIN user u ON p.userid = u.userid
//         JOIN avatar av ON p.userid = av.userid
//         LEFT JOIN orders o ON p.projectid = o.projectid
//         GROUP BY p.projectid, pt.projecttypeid
//       `);
    
//       const projects = new Map();
    
//       for (const row of rows) {
//         const projectId = row.projectid;
//         let project = projects.get(projectId);
    
//         if (!project) {
//           project = {
//             id: projectId,
//             userid: row.userid,
//             suserid: row.suserid,
//             username: row.username,
//             profilephoto: { url: `/profileImages/${row.profilephoto}` },
//             heading: row.heading,
//             category: row.category,
//             subcategory: row.subcategory,
//             description: row.description,
//             tags: row.tags,
//             images: [],
//             reviews: row.review_average || 0,
//             orders: row.order_count || 0,
//             types: [],
//           };
    
//           projects.set(projectId, project);
//         }
    
//         // Get images
//         const filenames = row.images ? JSON.parse(row.images) : [];
//         const imageUrls = filenames.map((filename) => ({ url: `/images/${filename}` }));
//         project.images = imageUrls;
//         // End get images
    
//         const type = {
//           id: row.projecttypeid,
//           type: row.type,
//           quote: row.quote,
//           price: row.price,
//           serviceone: row.serviceone,
//           servicetwo: row.servicetwo,
//           servicethree: row.servicethree,
//           servicefour: row.servicefour,
//           deliverydays: row.deliverydays,
//           revisions: row.revisions,
//         };
    
//         project.types.push(type);
//       }
    
//       res.status(200).json({
//         success: true,
//         message: "Projects retrieved successfully",
//         projects: Array.from(projects.values()),
//       });

      
//   } catch (error) {
//       console.log('Error in retrieving projects: ', error);
//       return next(new ErrorHandler('Internal server error', 500));
//   }

// })




// todo -- seller controller + buyer controller



const getProject = catchAsyncError(async(req, res, next) => {

    try {

        const slug = req.params.slug;

        const connection = await pool.getConnection();
        const [rows] = await connection.execute(`
        SELECT p.projectid, p.userid, p.suserid, u.username, u.country, dt.response_rate, dt.language, dt.language_control, p.heading, p.slug, p.category, p.subcategory, p.description, p.tags, p.images, pt.projecttypeid, pt.type, pt.quote, pt.price, pt.serviceone, pt.servicetwo, pt.servicethree, pt.servicefour, pt.deliverydays, pt.revisions, av.profilephoto,
        COUNT(DISTINCT o.order_id) AS order_count, 
        AVG(o.reviews) AS review_average
        FROM project p
        JOIN projecttype pt ON p.projectid = pt.projectid
        JOIN user u ON p.userid = u.userid
        JOIN profile dt ON p.userid = dt.userid
        JOIN avatar av ON p.userid = av.userid
        LEFT JOIN orders o ON p.projectid = o.projectid
        WHERE p.slug = ?
        GROUP BY p.projectid, pt.projecttypeid
      `, [slug]);
    
      const projectDetail = new Map();

      for (const row of rows) {
        const projectId = row.projectid;
        let project = projectDetail.get(projectId);
    
        if (!project) {
          project = {
            id: projectId,
            userid: row.userid,
            suserid: row.suserid,
            username: row.username,
            country: row.country,
            language: JSON.parse(row.language),
            language_control: JSON.parse(row.language_control),
            response_rate: row.response_rate,
            profilephoto: { link: `/profileImages/${row.profilephoto}` },
            heading: row.heading,
            slug: row.slug,
            category: row.category,
            subcategory: row.subcategory,
            description: row.description,
            tags: row.tags,
            images: [],
            reviews: row.review_average || 0,
            orders: row.order_count || 0,
            types: [],
          };
    
          projectDetail.set(projectId, project);
        }
    
        // Get images
        const filenames = row.images ? JSON.parse(row.images) : [];
        const imageUrls = filenames.map((filename) => ({ link: `/images/${filename}` }));
        project.images = imageUrls;
        // End get images
    
        const type = {
          id: row.projecttypeid,
          type: row.type,
          quote: row.quote,
          price: row.price,
          serviceone: row.serviceone,
          servicetwo: row.servicetwo,
          servicethree: row.servicethree,
          servicefour: row.servicefour,
          deliverydays: row.deliverydays,
          revisions: row.revisions,
        };
    
        project.types.push(type);
      }
      

        res.status(200).json({
            success: true,
            message: 'Project is Retrieved',
            projectDetail: Array.from(projectDetail.values())[0]
        })


    } catch (error) {
        console.log('Error in retrieving project: ', error);
        return next(new ErrorHandler('Internal server error', 500));
    }

})







// todo: get the logged user project -- seller controller
const getUserProjects = catchAsyncError(async(req, res, next) => {


  try {

      const connection = await pool.getConnection();

      const [rows] = await connection.execute(
          `
          SELECT p.*, pt.type, pt.quote, pt.price, pt.serviceone, pt.servicetwo, pt.servicethree, pt.servicefour, pt.deliverydays, pt.revisions
          FROM project p
          JOIN projecttype pt ON p.projectid = pt.projectid 
          WHERE p.userid = ?
          `,
          [req.user.userid]
        );

        const projects = [];

        // Create a map to keep track of unique projects by project ID
        const projectMap = new Map();
        rows.forEach((row) => {
          const projectID = row.projectid;
          const type = {
            id: row.projecttypeid,
            type: row.type,
            quote: row.quote,
            price: row.price,
            serviceone: row.serviceone,
            servicetwo: row.servicetwo,
            servicethree: row.servicethree,
            servicefour: row.servicefour,
            deliverydays: row.deliverydays,
            revisions: row.revisions,
          };
        
          // If project already exists in the map, add the type to the project's types array
          if (projectMap.has(projectID)) {
            const project = projectMap.get(projectID);
            project.types.push(type);
          } else { // Otherwise, create a new project object with an empty types array and add it to the map
            const project = {
              id: projectID,
              userid: row.userid,
              suserid: row.suserid,
              heading: row.heading,
              category: JSON.parse(row.category),
              subcategory: JSON.parse(row.subcategory),
              description: row.description,
              tags: JSON.parse(row.tags),
              images: JSON.parse(row.images),
              types: [type],
            };
            projectMap.set(projectID, project);
          }
        });
        
        // Add unique projects from the map to the projects array
        projectMap.forEach((project) => {
          projects.push(project);
        });

      res.status(200).json({
          success: true,
          message: 'Projects retrieved successfully',
          projects,
        });

      
  } catch (error) {
      console.log('Error in retrieving projects: ', error);
      return next(new ErrorHandler('Internal server error', 500));
  }

})




// update project
const updateProject =  catchAsyncError (async(req, res, next) => {
    
    try {

        const {heading, category, subcategory, description, tags, images, types} = req.body;
        const projectid = req.params.id
        const userid = req.user.userid;
        const suserid = req.user.suserid;
        
        const connection = await pool.getConnection();

        const [count_project] = await connection.execute('SELECT * FROM project WHERE projectid = ? AND userid = ?', [projectid, userid]);
        
        // CREATE SLUG
        const timestamp = new Date().toISOString();
        const slug = `${slugify(heading, { lower: true, strict: true })}-${userid}-${timestamp}`;
        // ENDS


        if (!count_project.length) {
            return res.status(404).json({ success: false, message: 'Project not found' });
          }

        await connection.execute('UPDATE project SET heading = ?, category = ?, subcategory = ?, description = ?, tags = ?, images = ?, slug = ? WHERE projectid = ? AND userid = ?', 
        [heading, JSON.stringify(category), JSON.stringify(subcategory), description, JSON.stringify(tags), JSON.stringify(images), slug, projectid, userid]);


         // Delete existing project types
        await connection.execute('DELETE FROM projecttype WHERE projectid = ? AND userid = ? AND suserid = ?', [projectid, userid, suserid]);

        // Insert updated project types
        for (const type of types) {

            const { type: typeName, quote, price, serviceone, servicetwo,servicethree, servicefour, deliverydays, revisions} = type;
            
            await connection.execute('INSERT INTO projecttype (userid, suserid, projectid, type, quote, price, serviceone, servicetwo, servicethree, servicefour, deliverydays, revisions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [userid, suserid, projectid, typeName, quote, price, serviceone, servicetwo, servicethree, servicefour, deliverydays, revisions]);

        } 

        
        console.log(`Project updated successfully`);


        res.status(201).json({
            success: true,
            message: 'Project is Updated',
        })


        connection.release();

    } catch (error) {
        console.log('Error in updating project: ', error);
        return next(new ErrorHandler('Internal server error', 500));
    }

});




// update project
const deleteProject =  catchAsyncError (async(req, res, next) => {


    const projectid = req.params.id;


    try {

        const connection = await pool.getConnection();

        // delete the project type first
        await connection.execute(
            'DELETE FROM projecttype WHERE projectid = ?',
            [projectid]
        );

        // now delete the exisitng project
        const [result] = await connection.execute(
            'DELETE FROM project WHERE projectid = ?',
            [projectid]
        );


        if(result.affectedRows === 0){
            return next(new ErrorHandler('Project not Found', 404));
        }

        res.status(202).json({
            success: true,
            message: 'Project is deleted',
        })


        connection.release();

    } catch (error) {

        console.log('Error in deleting project: ', error);
        return next(new ErrorHandler('Internal server error', 500));

    }



})




// helper function to count the total orders for a given project
const countOrders = (rows, projectId) => {
    let count = 0;
    rows.forEach((row) => {
      if (row.projectid === projectId) {
        count++;
      }
    });
    return count;
};
  
  

module.exports = {createProject, getProjects, getUserProjects, getProject, updateProject, deleteProject}