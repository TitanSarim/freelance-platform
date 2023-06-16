import { Fragment, useState } from "react";

import {
    Button, Dialog, DialogHeader, DialogBody, DialogFooter,
  } from "@material-tailwind/react";
import {BsArrowDownShort} from 'react-icons/bs'

import './category.css'



export default function DialogBox ({categories}){

    const [size, setSize] = useState(null);

    const handleOpen = (value) => setSize(value);


  return (

    <Fragment>
    
        <button className="home__category__dialog__box__btn" onClick={() => handleOpen("md")} variant="gradient">
            <span>Show All</span>
            <BsArrowDownShort/>
        </button>

        <Dialog open={size === "md"} size={"md"} className="bg-white-50">
            
            <DialogHeader>
                Categories
            </DialogHeader>

            <DialogBody className="home__category__dialog__box__map">
                {categories.map((category) => (
                    <div className="home__category__dialog__box__single__element" key={category.id}>
                        <span>{category.category}</span>
                    </div>
                ))}
            </DialogBody>

            <DialogFooter>
                <Button variant="text" color="red" onClick={() => handleOpen(null)}>
                    <span>Back</span>
                </Button>
            </DialogFooter>

        </Dialog>

    </Fragment>


  )
}

