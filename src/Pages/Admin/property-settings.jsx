import React from "react";
import { AdminSettingsSuites } from "../Admin/Settings/property-settings-suites";
import { AdminSettingsFacilities } from "../Admin/Settings/property-settings-facilities";
import { AdminSettingsRoomtypes } from "../Admin/Settings/property-settings-roomtypes";
import { AdminSettingsBeds } from "../Admin/Settings/property-settings-beds";

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
