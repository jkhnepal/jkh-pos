"use client"
import React, { useState } from 'react';

import { Resizable } from "re-resizable";

const EmbeddedWebsite = () => {
    const style = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "solid 1px #ddd",
        background: "#f0f0f0",
      };
      
      const websiteUrl = "https://webxnep.com/";
  return (
    <Resizable
    style={style}
    defaultSize={{
      width: 200,
      height: 200,
    }}
  >
    <iframe
      src={websiteUrl}
      title="Embedded Website"
      style={{ border: "none", width: "100%", height: "100%" }}
    />
  </Resizable>
  );
};

export default EmbeddedWebsite;
