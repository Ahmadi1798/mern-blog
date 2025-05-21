import { FileInput, Select, TextInput, Button } from 'flowbite-react';
import TextEditor from '../Components/TextEditor';

const CreatePost = () => {
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
            <FileInput accept="image/*" type="file" />
            <Button className="text-sm w-full" type="button">
              Upload Image
            </Button>
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
