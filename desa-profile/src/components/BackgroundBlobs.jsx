const BackgroundBlobs = () => {
  return (
    <div className="bg-ambient-decor" aria-hidden="true">
      {/* Soft nature gradient blobs */}
      <div className="bg-blob bg-blob-nature-1" />
      <div className="bg-blob bg-blob-nature-2" />
      <div className="bg-blob bg-blob-nature-3" />
      
      {/* Mountain silhouette vector overlay */}
      <div className="bg-mountain-silhouette">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" fill="currentColor">
          <path opacity="0.04" d="M0,192L48,202.7C96,213,192,235,288,229.3C384,224,480,192,576,181.3C672,171,768,181,864,197.3C960,213,1056,235,1152,229.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path opacity="0.06" d="M0,256L60,240C120,224,240,192,360,192C480,192,600,224,720,229.3C840,235,960,213,1080,202.7C1200,192,1320,192,1380,192L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
      
      {/* Leaves & rice field grid patterns */}
      <div className="bg-nature-grid" />
    </div>
  );
};

export default BackgroundBlobs;

