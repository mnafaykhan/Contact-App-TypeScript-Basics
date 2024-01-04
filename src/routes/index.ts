import express, { Express, Router } from "express";
import contactRoutes from "./contact";

export default function (app:Express) :void{
    //----------------------------------
    app.use("/api/contact", contactRoutes);
    //----------------------------------
  };
  
