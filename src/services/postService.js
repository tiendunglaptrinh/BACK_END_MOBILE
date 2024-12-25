import Post from "../models/postModel.js";

class PostService {
  createPost = async (post, response) => {
    try {
      console.log(">>> check data from controller: ", post);

      const newPost = await Post.create(post);

      return response.status(201).json({
        success: true,
        message: "Post created successfully!",
        user: newPost,
      });
    } catch (error) {
      return response.status(200).json({
        success: false,
        error: error.message,
      });
    }
  };
  UpdatePost = async (post, response) => {
    try {
      console.log(">>> check data from controller: ", post);

      const {
        namePost,
        typeRoom,
        price,
        deposit,
        description,
        address,
        bedroom,
        bathroom,
        comfort,
        image,
        idPost,
      } = post;

      const infoPostUpdate = {
        namePost,
        typeRoom,
        price,
        deposit,
        description,
        address,
        bedroom,
        bathroom,
        comfort,
        image,
      };
      console.log(">>> check infoPostUpdate: ", infoPostUpdate);

      const [rowsUpdated, [updatedPost]] = await Post.update(infoPostUpdate, {
        where: { id: idPost },
        returning: true,
      });

      if (rowsUpdated === 0) {
        return response.status(404).json({
          success: false,
          message: "Không tìm thấy Bài đăng!",
        });
      }

      return response.status(201).json({
        success: true,
        message: "Post updated successfully!",
        post: updatedPost,
      });
    } catch (error) {
      return response.status(200).json({
        success: false,
        error: error.message,
      });
    }
  };
}

export default new PostService();
