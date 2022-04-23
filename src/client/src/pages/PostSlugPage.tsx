import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const PostSlugPage = () => {
  let params = useParams();
  console.log(params.id);

  useEffect(() => {
    console.log(params.id);
  });
  return <div>slug page</div>;
};
export default PostSlugPage;
