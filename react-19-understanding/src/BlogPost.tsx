export default function BlogPost({
  post,
}: {
  post: {
    metaTitle: string;
    title: string;
    keywords: string[];
  };
}) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.metaTitle}</title>
      <meta name="author" content="Josh C. Story" />
      <link rel="author" href="https://twitter.com/joshcstory/" />
      <meta name="keywords" content={post.keywords.join(", ")} />
      <p>Eee equals em-see-squared...</p>
    </article>
  );
}
