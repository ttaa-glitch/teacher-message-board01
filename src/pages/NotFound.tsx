import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: '#fff9f2' }}
    >
      <h1
        className="text-6xl font-bold mb-4"
        style={{ color: '#ff8c42' }}
      >
        404
      </h1>
      <p className="text-lg mb-6" style={{ color: '#7a6a5c' }}>
        页面走丢了
      </p>
      <Link
        to="/"
        className="px-6 py-2 rounded-lg text-white"
        style={{ backgroundColor: '#ff8c42' }}
      >
        回到首页
      </Link>
    </div>
  );
}
