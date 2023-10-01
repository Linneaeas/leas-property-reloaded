import React from "react";
import { AdminSettingsSuites } from "./property-settings-suites";
import { AdminSettingsFacilities } from "./property-settings-facilities";
import { AdminSettingsRoomtypes } from "./property-settings-roomtypes";
import { AdminSettingsBeds } from "./property-settings-beds";

export function AdminPropertySettings() {
  return (
    <div>
      <AdminSettingsSuites></AdminSettingsSuites>
      <AdminSettingsFacilities></AdminSettingsFacilities>
      <AdminSettingsRoomtypes></AdminSettingsRoomtypes>
      <AdminSettingsBeds></AdminSettingsBeds>
    </div>
  );
}
