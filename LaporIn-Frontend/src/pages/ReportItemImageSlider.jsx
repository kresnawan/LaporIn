import React from "react";
import Slider from "react-slick";

export default function ReportItemImageSlider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider.default {...settings}>
      <div className="bg-amber-200 ml-10">
        <h3>1</h3>
      </div>
      <div className=" bg-amber-200 mx-10">
        <h3>1</h3>
      </div>
      <div className=" bg-amber-200 mx-10">
        <h3>1</h3>
      </div>
      <div className=" bg-amber-200 mx-10">
        <h3>1</h3>
      </div>
    </Slider.default>
  );
}