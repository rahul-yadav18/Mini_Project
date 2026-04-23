import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* ------------ Left Section ------------ */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="text-sm text-gray-600">
            MediConnect is a modern healthcare platform that helps patients
            easily connect with trusted doctors, book appointments, and manage
            their health seamlessly.
          </p>
        </div>

        {/* ------------ Center Section ------------ */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">MEDICONNECT</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Smart Healthcare Appointment System</li>
            <li>Connecting Patients & Doctors Seamlessly</li>
            <li>Developed for Academic Project</li>
          </ul>
        </div>
      </div>

      {/* ------------ Copyright Text ------------ */}
      <div>
        <hr />
        <p>Copyright © 2024 MediConnect - All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
