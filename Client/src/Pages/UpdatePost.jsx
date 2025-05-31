import { FileInput, Select, TextInput, Button } from 'flowbite-react';
import TextEditor from '../Components/TextEditor';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UpdatePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [postFormData, setPostFormData] = useState({});

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await axios.get(`/api/v1/posts/getPosts?postId=${postId}`);
        setPostFormData(res.data.posts[0]);
        setImageUrl(res.data.posts[0].image);
        toast.success('Success');
      };
      fetchPost();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  }, [postId]);

  const handleImageUpload = async () => {
    if (!file) {
      toast.error('Please select an image first');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'post_images');
      const res = await axios.post('/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImageUrl(res.data.url);
      setPostFormData({ ...postFormData, image: res.data.url });
      toast.success('Image uploaded successfully');

      // logic for adding image to Claudinay and then updating the post image url on database
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error uploading image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `/api/v1/posts/updatePost/${postFormData._id}/${currentUser._id}`,
        postFormData
      );
      toast.success('Post Updated successfully');
      console.log(res);
      navigate(`/post/${res.data.slug}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen py-10 flex items-center flex-col w-full">
      <h1 className="text-2xl md:text-4xl mb-4 font-semibold ">Update Post</h1>
      <form
        className="md:w-4xl flex items-center  flex-col"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col  px-10 md:px-0 gap-3 max-w-2xl w-full ">
          <TextInput
            placeholder="Title"
            value={postFormData.title}
            required
            type="text"
            onChange={(e) =>
              setPostFormData({ ...postFormData, title: e.target.value })
            }
          />
          <Select
            value={postFormData.category}
            onChange={(e) =>
              setPostFormData({ ...postFormData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a Category</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
            <option value="nodejs">Node.js</option>
          </Select>
          <div className="flex items-center justify-between gap-4">
            <FileInput
              accept="image/*"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button
              className="text-sm w-full cursor-pointer"
              type="button"
              onClick={handleImageUpload}
            >
              Upload Image
            </Button>
          </div>
          <div>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Uploaded"
                className="object-cover w-full"
              />
            )}
          </div>
          <div>
            <TextEditor
              value={postFormData.content}
              onChange={(content) =>
                setPostFormData({ ...postFormData, content: content })
              }
            />
          </div>
          <Button type="submit" color="blue" className="cursor-pointer">
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};
export default UpdatePost;
