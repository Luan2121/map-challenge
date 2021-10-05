const getMarkerUrl = ({ figure = true }) => {
    const svg = figure
      ? `
        <svg 
            style="width:100px;height:100px;"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24"
        >
            <defs>
                <style>.cls-1,.cls-3{fill:#fb5a7c;}.cls-1{opacity:0.22;}.cls-2{fill:#fff;}</style>
            </defs>
            <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                    <circle class="cls-1" cx="12" cy="12" r="12"/>
                    <circle class="cls-2" cx="12" cy="12" r="4.43"/>
                    <circle class="cls-3" cx="12" cy="12" r="3.24"/>
                </g>
            </g>
        </svg>
    ` : "";
    const url = "data:image/svg+xml;charset=UTF-8;base64," + btoa(svg);
    return url;
  };

  export { getMarkerUrl };