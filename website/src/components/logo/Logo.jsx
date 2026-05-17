const Logo = ({ size }) => (
  <svg
    id="logo"
    data-name="logo"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 960 640"
    width={size}
  >
    <defs>
      <style>{".cls-1{fill:#4a7ce7;}"}</style>
    </defs>
    <polygon
      className="cls-1"
      points="960 0 480 0 0 480 160 640 640 640 960 320 640 320 960 0"
    />
  </svg>
);
export default Logo;
