import Post from "../models/postModel.js";

class PostController {
  createPostStep1 = async (req, res) => {
    try {
      const { namePost, typeRoom, price, deposit, description } = req.body;

      // Validate input
      if (!namePost)
        return res
          .status(400)
          .json({ success: false, message: "Vui lòng nhập tên bài đăng." });
      if (!typeRoom)
        return res
          .status(400)
          .json({ success: false, message: "Vui lòng chọn loại phòng." });
      if (!price || price < 0)
        return res
          .status(400)
          .json({ success: false, message: "Giá phải lớn hơn 0." });
      if (deposit === undefined || deposit < 0)
        return res
          .status(400)
          .json({ success: false, message: "Tiền cọc phải lớn hơn 0." });
      if (!description)
        return res
          .status(400)
          .json({ success: false, message: "Vui lòng nhập mô tả." });

      req.session = req.session || {};
      req.session.post = { namePost, typeRoom, price, deposit, description };

      return res.status(200).json({
        message: "Next step -> 2",
        current_post: req.session.post,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra. Vui lòng thử lại.",
        error: error.message,
      });
    }
  };
  createPostStep2 = async (req, res) => {
    const { address, bedroom, bathroom, comfort } = req.body;

    if (!address)
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập địa chỉ." });
    if (!bedroom || bedroom < 0)
      return res.status(400).json({
        success: false,
        message: "Số phòng ngủ phải lớn hơn hoặc bằng 0.",
      });
    if (!bathroom || bathroom < 0)
      return res.status(400).json({
        success: false,
        message: "Số phòng tắm phải lớn hơn hoặc bằng 0.",
      });
    if (!comfort)
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn ít nhất một tiện nghi.",
      });

    const currentPost = req.session.post;
    if (!currentPost) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy bài đăng. Vui lòng thực hiện bước 1 trước.",
      });
    }

    req.session.post = {
      ...currentPost,
      address,
      bedroom,
      bathroom,
      comfort,
    };

    return res.status(200).json({
      success: true,
      message: "Next step -> 3",
      current_post: req.session.post,
    });
  };
  createPostStep3 = async (req, res) => {
    const { image } = req.body;
    // verify userId from token
    const token = req.headers["authorization"].split(" ")[1];
    req.session.post = {
      ...currentPost,
      address,
      bedroom,
      bathroom,
      comfort,
      image,
      userId,
    };
  };

  updatePostStep1 = async (req, res) => {
    try {
      const { namePost, typeRoom, price, deposit, description } = req.body;

      if (!namePost)
        return res
          .status(400)
          .json({ success: false, message: "Vui lòng nhập tên bài đăng." });
      if (!typeRoom)
        return res
          .status(400)
          .json({ success: false, message: "Vui lòng chọn loại phòng." });
      if (!price || price < 0)
        return res
          .status(400)
          .json({ success: false, message: "Giá phải lớn hơn 0." });
      if (deposit === undefined || deposit < 0)
        return res
          .status(400)
          .json({ success: false, message: "Tiền cọc phải lớn hơn 0." });
      if (!description)
        return res
          .status(400)
          .json({ success: false, message: "Vui lòng nhập mô tả." });

      req.session = req.session || {};
      req.session.post = { namePost, typeRoom, price, deposit, description };

      return res.status(200).json({
        message: "Next step -> 2",
        current_post: req.session.post,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra. Vui lòng thử lại.",
        error: error.message,
      });
    }
  };
  updatePostStep2 = async (req, res) => {
    const { address, bedroom, bathroom, comfort } = req.body;

    if (!address)
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập địa chỉ." });
    if (!bedroom || bedroom < 0)
      return res.status(400).json({
        success: false,
        message: "Số phòng ngủ phải lớn hơn hoặc bằng 0.",
      });
    if (!bathroom || bathroom < 0)
      return res.status(400).json({
        success: false,
        message: "Số phòng tắm phải lớn hơn hoặc bằng 0.",
      });
    if (!comfort)
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn ít nhất một tiện nghi.",
      });

    const currentPost = req.session.post;
    if (!currentPost) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy bài đăng. Vui lòng thực hiện bước 1 trước.",
      });
    }

    req.session.post = {
      ...currentPost,
      address,
      bedroom,
      bathroom,
      comfort,
    };

    return res.status(200).json({
      success: true,
      message: "Next step -> 3",
      current_post: req.session.post,
    });
  };
  getAllPosts = async (req, res) => {
    try {
      const posts = await Post.findAll(); // Lấy tất cả bài đăng
      if (!posts || posts.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Không có bài đăng nào!",
        });
      }
      return res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài đăng:", error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy danh sách bài đăng.",
      });
    }
  };

  getPost = async (req, res) => {
    const { id } = req.params; // Lấy `id` từ params
    try {
      const post = await Post.findOne({
        where: { id }, // Tìm bài đăng có id khớp
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: `Không tìm thấy bài đăng với id: ${id}`,
        });
      }

      return res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      console.error(`Lỗi khi lấy bài đăng với id ${id}:`, error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy bài đăng.",
      });
    }
  };
}

export default new PostController();
