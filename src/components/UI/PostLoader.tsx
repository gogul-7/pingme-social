function PostLoader() {
  return (
    <div
      className="absolute left-[300px] top-[300px] animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default PostLoader;
