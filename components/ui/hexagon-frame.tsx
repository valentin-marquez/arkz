"use client";
import { cn } from "@/lib/utils";
import React from "react";

interface HexagonFrameProps {
  width?: number;
  height?: number;
  strokeColor?: string;
  fillColor?: string;
  imagePath?: string;
  backgroundColor?: string;
  imageId?: string;
}

const HexagonFrame: React.FC<HexagonFrameProps> = ({
  width = 234,
  height = 202,
  strokeColor,
  imagePath,
  backgroundColor = "transparent",
  imageId = "defaultImageId",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 234 202"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <pattern
          id={`imagePattern-${imageId}`}
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <image
            xlinkHref={imagePath}
            x="0"
            y="0"
            width="1"
            height="1"
            preserveAspectRatio="xMidYMid slice"
          />
        </pattern>
        <clipPath id={`hexagonClip-${imageId}`}>
          <path d="M70.5 179.5H161.5L207 101L161.5 22.5H70.5L25 101L70.5 179.5Z" />
        </clipPath>
      </defs>

      {/* Background */}
      <path
        d="M70.5 179.5H161.5L207 101L161.5 22.5H70.5L25 101L70.5 179.5Z"
        className="fill-card/40 animate-pulse duration-[2s] ease-in-out"
      />

      {/* Image (if provided) */}
      {imagePath && (
        <path
          d="M70.5 179.5H161.5L207 101L161.5 22.5H70.5L25 101L70.5 179.5Z"
          fill={`url(#imagePattern-${imageId})`}
        />
      )}

      {/* background black path space between */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M176 201.5L233 101.5L176 1H59L1 101.5L59 201.5H176ZM161.5 179.5H70.5L25 101L70.5 22.5H161.5L207 101L161.5 179.5Z"
        className="fill-card/40 animate-pulse duration-&lsqb;2s&rsqb; ease-in-out"
      />

      {/* slim stroke inside and outside  */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M176 201.5L233 101.5L176 1H59L1 101.5L59 201.5H176ZM161.5 179.5H70.5L25 101L70.5 22.5H161.5L207 101L161.5 179.5Z"
        stroke={strokeColor}
        strokeLinejoin="round"
        className="saturate-150"
      />

      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M176 201.5L233 101.5L176 1H59L1 101.5L59 201.5H176ZM161.5 179.5H70.5L25 101L70.5 22.5H161.5L207 101L161.5 179.5Z"
        stroke="url(#pattern0_0_1)"
        strokeOpacity="0.2"
        strokeLinejoin="round"
      />

      {/* big hexagon stroke middle */}
      <path
        d="M67.5 187.5H167L218 100.5L167.5 14H66L16 100.5L67.5 187.5Z"
        stroke={strokeColor}
        strokeWidth="10"
      />
      <path
        d="M67.5 187.5H167L218 100.5L167.5 14H66L16 100.5L67.5 187.5Z"
        stroke="url(#pattern1_0_1)"
        strokeWidth="10"
      />
      <path
        d="M67.5 187.5H167L218 100.5L167.5 14H66L16 100.5L67.5 187.5Z"
        stroke={strokeColor}
        strokeOpacity="0.5"
        strokeWidth="10"
      />

      <defs>
        <pattern
          id="pattern0_0_1"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_0_1"
            transform="matrix(0.000244141 0 0 0.000282497 0 -0.0785536)"
          />
        </pattern>
        <pattern
          id="pattern1_0_1"
          patternContentUnits="objectBoundingBox"
          width="1.62218"
          height="1.88865"
        >
          <use
            xlinkHref="#image1_0_1"
            transform="matrix(0 0.000461095 -0.00039604 0 1.62218 0)"
          />
        </pattern>
        <g
          className={cn(
            "grayscale hue-rotate-[60deg]",
            `[&>image]:hue-rotate-[${strokeColor}]`
          )}
        >
          <image
            id="image0_0_1"
            width="4096"
            height="4096"
            xlinkHref={"/mask.jpg"}
          />
          <image
            id="image1_0_1"
            width="4096"
            height="4096"
            xlinkHref={"/mask.jpg"}
          />
        </g>
      </defs>
    </svg>
  );
};

export default HexagonFrame;
