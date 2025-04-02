const Loader = ({ text = "Loading...", isFullScreen = true }) => {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${isFullScreen ? 'h-screen  w-screen' : 'h-full w-full'}`}>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full border-blue-500 animate-spin"></div>
          {text && (
            <p className="mt-4 text-green-950 font-medium">{text}</p>
          )}
        </div>
      </div>
    );
  };
  
  export default Loader;