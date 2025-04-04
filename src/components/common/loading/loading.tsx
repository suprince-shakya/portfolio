const LoadingComponent = () => {
  return (
    <div className="absolute top-[50%] left-[50%] z-200">
      <div className="flex justify-start items-center">
        <div id="spinner-container" className="space-y-10">
          <div className="flex justify-center">
            <div
              className="w-16 h-16 border-4 border-blue-500
                        border-t-transparent rounded-full 
                        animate-spin"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;
