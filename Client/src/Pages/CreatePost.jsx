import { FileInput, Select, TextInput, Button } from 'flowbite-react';
import TextEditor from '../Components/TextEditor';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleImageUpload = async () => {
    if (!file) {
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
      toast.success('Image uploaded successfully');

      // logic for adding image to Claudinay and then updating the post image url on database
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error uploading image');
    }
  };
  return (
    <div className="min-h-screen py-10 flex items-center flex-col w-full">
      <h1 className="text-2xl md:text-4xl mb-4 font-semibold ">Create Post</h1>
      <form className="md:w-4xl flex items-center  flex-col">
        <div className="flex flex-col  px-10 md:px-0 gap-3 max-w-2xl w-full ">
          <TextInput placeholder="Title" type="text"></TextInput>
          <Select>
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
              className="text-sm w-full"
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
            <TextEditor />
          </div>
        </div>
      </form>
    </div>
  );
};
export default CreatePost;
