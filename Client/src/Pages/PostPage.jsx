import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, Spinner } from 'flowbite-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Make sure this matches your import

const PostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/posts/getPosts?slug=${slug}`);
        setPost(res.data.posts[0]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    };
    fetchPost();
  }, [slug]);

  // Highlight code blocks after content is rendered
  useEffect(() => {
    Prism.highlightAll();
  }, [post.content]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="xl" className="trasiton-all duration-200" />
      </div>
    );
  }
  return (
    <main className="flex flex-col max-w-6xl items-center mx-auto min-h-screen p-4 ">
      <h1 className="text-3xl md:text-4xl text-center mt-10 p-2 max-w-2xl">
        {post && post.title}
      </h1>
      <Link to={`/search?category=${post?.category}`} className="mt-5">
        <Button
          color="gray"
          pill
          outline
          size="xs"
          className="text-teal-600 cursor-pointer transition-all duration-200 hover:scale-105 "
        >
          {post?.category}
        </Button>
      </Link>
      <img
        src={post?.image}
        alt={post?.title}
        className="w-full mt-10 p-2 object-cover max-h-[800px] rounded-md "
      />
      <div className="flex w-full items-center  p-2 border-b mt-2 text-sm dark:border-b-slate-700 border-b-slate-800  justify-between">
        <span>{new Date(post?.updatedAt).toLocaleDateString()}</span>
        <span>
          {((post?.content || '').length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-2 mt-10 post-content"
        dangerouslySetInnerHTML={{ __html: post?.content }}
      ></div>
    </main>
  );
};
export default PostPage;
