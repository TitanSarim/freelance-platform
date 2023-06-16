const pool = require('../connection/database');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncError = require('../middleware/catchAsyncError')




const createCategory = catchAsyncError(async(req, res, next) => {

    try{

        const{category, description,subcategories} = req.body

        const connection = await pool.getConnection()

        const [result] =await connection.execute('INSERT INTO category (category, description) VALUES(?, ?)', [category, description]);

        // Insert subcategories for the newly created category
        const values = subcategories.map((subcategory) => [result.insertId, subcategory])
        await connection.query('INSERT INTO subcategories (category_id, subcategories) VALUES ?', [values])

        res.status(200).json({
            success: true,
            message: 'Category and Subcategories are Created',
            info: result
        })


    } catch (error) {
        console.log('Error in Creating Categories and Subcategories: ', error);
        return next(new ErrorHandler('Internal server error', 500));
    }

})


const updateCategory = catchAsyncError(async (req, res, next) => {


    try {
      const { category, description, subcategories, categoryId } = req.body;
    //   const categoryId = req.params.id;
  
      const connection = await pool.getConnection();
  
      // Update category
      const [result] = await connection.execute(
        'UPDATE category SET category = ?, description = ? WHERE id = ?',
        [category, description, categoryId]
      );
        
      // Delete all existing subcategories for the category
      await connection.execute(
        'DELETE FROM subcategories WHERE category_id = ?',
        [categoryId]
      );
  
      // Insert updated subcategories for the category
      const values = subcategories.map((subcategory) => [
        categoryId,
        subcategory,
      ]);
      await connection.query(
        'INSERT INTO subcategories (category_id, subcategories) VALUES ?',
        [values]
      );

        
      connection.release()

      res.status(200).json({
        success: true,
        message: 'Category and Subcategories are Updated',
        info: result,
      });
    } catch (error) {
      console.log('Error in Updating Categories and Subcategories: ', error);
      return next(new ErrorHandler('Internal server error', 500));
    }
});


const getAllCategories = catchAsyncError(async(req, res, next) => {

    try{

        const connection = await pool.getConnection()

        const [categoriesResult] = await connection.query('SELECT * FROM category');

        const categories = await Promise.all(categoriesResult.map(async (category) => {
            const [subcategoriesResult] = await connection.execute('SELECT subcategories FROM subcategories WHERE category_id = ?', [category.id]);
            const subcategories = subcategoriesResult.map((subcategory) => subcategory.subcategories);
            return {
                id: category.id,
                category: category.category,
                description: category.description,
                subcategories: subcategories
            }
        }));

        connection.release();


        res.status(200).json({
            success: true,
            message: 'All Categories and Subcategories are fetched',
            categories: categories
        })


    } catch (error) {
        console.log('Error in fetching Categories and Subcategories: ', error);
        return next(new ErrorHandler('Internal server error', 500));
    }

})

module.exports = { getAllCategories }


module.exports={createCategory, updateCategory, getAllCategories}