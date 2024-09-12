import mongoose from "mongoose";
import Post from "../modling/post_schema.ts";
import type { Request, Response } from 'express';
import uploadToCloudinary from "../utils/uploadToCloudinary.ts";
const getPosts = async (req: any, res: any) => {
    try {
        const posts = await Post.find();
        return res.status(200).json(posts);
    }
    catch (err) {
      //  console.log('errr when fetching from database')
        return res.status(500).json({ message: 'something went wrong' })
    }
}
const addPost = async (req: Request, res: Response) => {
    //console.log("in add post controller");
    const post = req.body;
    //console.log("this is file " , req.file);
    const result = await uploadToCloudinary(req.file);
   // console.log("post uploaded to cloudinary and this is result as path string", result);
    post.imageUrl = result;
    const newPost = new Post(post);
    try {
       // console.log('trying to save in database');
        const savedpost = await newPost.save();
       // console.log('post saved in database');

        return res
        .status(200)
        .json({ user:savedpost, message: 'post added successfully' });
    }
    catch (err:any) {
        return res.status(500).json({ message: err.message });
    }
 }
const deletePost = async (req: Request, res: any) => { 

   // Post.findByIdAndDelete(new mongoose.Types.ObjectId(req.body))
    res.json({message:'post Deleted'});
}



const updatePost = async (req: Request, res: any) => {
   // console.log('in update post controller',req.body);
    //for storing the cloudinary url
    let data = JSON.parse(req.body.Data);
    if(req.file){
         data.imageUrl = await uploadToCloudinary(req.file);
    }

     try{
       // console.log('in try block of update post controller',data);
     // const objectId = new mongoose.Types.ObjectId(data._id);
     //console.log(data._id);
      //console.log('object id',objectId);
     const updatedPost = await Post.findByIdAndUpdate( new mongoose.Types.ObjectId(data._id), data, { new: true });
        return res.status(200).json({ message: 'post updated successfully',
          updatedPost: updatedPost
         });
     }
     catch(err:any){
        return res.status(500).json({ message: err.message });
     }
 }

export { getPosts, addPost, deletePost, updatePost }