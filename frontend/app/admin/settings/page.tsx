"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [setting, setSetting] = useState<any>();
  const [currentValue, setCurrentValue] = useState<string>("");

  // Fetch the setting when the component is mounted
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/settings`);
        const settingData = res?.data.data[0];
        setSetting(settingData);
        setCurrentValue(settingData?.discountOfferPercentage || ""); // Set initial value
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  // Function to handle updating the setting
  const [isUpdating, setIsUpdating] = useState(false);
  const updateSetting = async () => {
    try {
      setIsUpdating(true);
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_URL_API}/settings/${setting?.settingId}`, {
        discountOfferPercentage: currentValue,
      });
      setIsUpdating(false);
      toast.success("Setting updated successfully");
    } catch (error) {
      console.log(error);
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <Card className="w-4/12 p-4 space-y-4">
        <label htmlFor="discount">Discount Offer In Percentage</label>
        <Input
          id="discount"
          placeholder="Enter percentage"
          value={currentValue} // Bind the value to currentValue
          onChange={(e) => setCurrentValue(e.target.value)} // Update currentValue on input change
        />
        <Button
          disabled={isUpdating}
          onClick={updateSetting}
          className="w-full">
          {isUpdating ? "Updating..." : "Update"}
        </Button>
      </Card>
    </div>
  );
}
