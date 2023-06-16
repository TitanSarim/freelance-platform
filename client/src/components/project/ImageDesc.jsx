import React from 'react';
import ImageGallery from 'react-image-gallery';
import './ImageDesc.css';

const ImageDesc = ({ projectDetail }) => {

  const items =

    projectDetail.images &&
    projectDetail.images.map((image) => ({
      original: image.link,
      thumbnail: image.link,
    }));


  return (

    <div className='project_detail_imagedesc_container'>

        <div className='project__detail__images'>
        {items ? (
            <div className='project__detail__image'>
            <ImageGallery 
            showFullscreenButton={false}
            showPlayButton={false}
            items={items} 
            showNav={true}
            thumbnailPosition={'bottom'}
            slideDuration={1000}
            slideInterval={4000}
            startIndex={0}
            sizes="500"
            />
            </div>
        ) : null}
        </div>

        <div className='project_detail_imagedesc_detailbox_heading'>
            <p>Project Details</p>
        </div>

        <div className='project_detail_imagedesc_description'>
            <span>
                {projectDetail.description}
            </span>
        </div>

    </div>

  );
};

export default ImageDesc;
