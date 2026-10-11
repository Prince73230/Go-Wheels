"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Settings,
  Building2,
  CalendarDays,
  Car,
  Bike,
  CreditCard,
  Bell,
  ShieldCheck,
  Wrench,
  Save,
  Mail,
  Phone,
  MapPin,
  IndianRupee,
  Clock3,
  Lock,
  Smartphone,
  Database,
  RefreshCw,
  LogOut,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

// ======================================================
// TOGGLE
// ======================================================

type ToggleProps = {
  enabled: boolean;
  onChange: () => void;
};

function Toggle({
  enabled,
  onChange,
}: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${enabled
        ? "bg-cyan-400"
        : "bg-slate-300"
        }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${enabled
          ? "left-6"
          : "left-1"
          }`}
      />
    </button>
  );
}

// ======================================================
// SETTINGS TYPE
// ======================================================

type SettingsData = {
  appName: string;
  supportEmail: string;
  supportPhone: string;
  location: string;
  currency: string;

  minRental: string;
  maxRental: string;
  advanceBooking: string;
  lateFee: string;

  sameDayBooking: boolean;
  autoAvailability: boolean;

  autoConfirm: boolean;
  adminApproval: boolean;
  allowCancellation: boolean;
  allowModification: boolean;

  tax: string;
  deposit: string;
  onlinePayment: boolean;
  cashPayment: boolean;

  newBooking: boolean;
  bookingCancellation: boolean;
  newUser: boolean;
  vehicleAdded: boolean;
  adminAlerts: boolean;

  twoFactor: boolean;
  loginAlerts: boolean;

  maintenanceMode: boolean;
};

// ======================================================
// DEFAULT SETTINGS
// ======================================================

const defaultSettings: SettingsData = {
  appName: "GoWheels",
  supportEmail: "support@gowheels.com",
  supportPhone: "+91 98765 43210",
  location: "Dehradun, Uttarakhand",
  currency: "INR",

  minRental: "1",
  maxRental: "30",
  advanceBooking: "60",
  lateFee: "200",

  sameDayBooking: true,
  autoAvailability: true,

  autoConfirm: true,
  adminApproval: false,
  allowCancellation: true,
  allowModification: true,

  tax: "18",
  deposit: "1000",
  onlinePayment: true,
  cashPayment: true,

  newBooking: true,
  bookingCancellation: true,
  newUser: true,
  vehicleAdded: false,
  adminAlerts: true,

  twoFactor: false,
  loginAlerts: true,

  maintenanceMode: false,
};

// ======================================================
// MAIN PAGE
// ======================================================

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] =
    useState<SettingsData>(
      defaultSettings
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");

  // ======================================================
  // UPDATE SETTING
  // ======================================================

  const updateSetting = <
    K extends keyof SettingsData
  >(
    key: K,
    value: SettingsData[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  // ======================================================
  // FETCH SETTINGS
  // ======================================================

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/settings",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            `API returned an invalid response (${response.status}).`
          );
        }

        if (!data.success || !data.settings) {
          throw new Error(
            data.message ||
            "Invalid settings response."
          );
        }

        setSettings({
          ...defaultSettings,
          ...data.settings,
        });
      } catch (err) {
        console.error(
          "Failed to fetch settings:",
          err
        );

        setError(
          (err instanceof Error ? err.message : undefined) ||
          "Failed to load settings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // ======================================================
  // SAVE SETTINGS
  // ======================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const response = await fetch(
        "/api/settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          `Failed to save settings (${response.status}).`
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
          "Failed to save settings."
        );
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.error(
        "Failed to save settings:",
        err
      );

      setError(
        (err instanceof Error ? err.message : undefined) ||
        "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });

      router.push("/navigation/login");
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-125 items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <RefreshCw
            size={22}
            className="animate-spin"
          />

          <span className="text-sm font-medium">
            Loading settings...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 pb-10">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
              <Settings size={24} />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-500">
                Administration
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                Settings
              </h1>
            </div>

          </div>

          <p className="mt-3 text-sm text-slate-500">
            Manage your GoWheels rental platform,
            bookings, vehicles and system preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <RefreshCw
                size={18}
                className="animate-spin"
              />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>

      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

          <AlertTriangle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              Settings Error
            </p>

            <p className="mt-1">
              {error}
            </p>
          </div>

        </div>
      )}

      {/* ==================================================
          SUCCESS
      ================================================== */}

      {saved && (
        <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">

          <CheckCircle2 size={20} />

          <span>
            Settings saved successfully.
          </span>

        </div>
      )}

      {/* ==================================================
          GENERAL SETTINGS
      ================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">

        <SectionHeader
          icon={<Building2 size={20} />}
          title="General Settings"
          description="Basic information about your GoWheels platform."
        />

        <div className="grid gap-5 p-6 md:grid-cols-2">

          <InputField
            label="Application Name"
            icon={<Building2 size={17} />}
            value={settings.appName}
            onChange={(value) =>
              updateSetting(
                "appName",
                value
              )
            }
          />

          <InputField
            label="Support Email"
            icon={<Mail size={17} />}
            value={settings.supportEmail}
            onChange={(value) =>
              updateSetting(
                "supportEmail",
                value
              )
            }
            type="email"
          />

          <InputField
            label="Support Phone"
            icon={<Phone size={17} />}
            value={settings.supportPhone}
            onChange={(value) =>
              updateSetting(
                "supportPhone",
                value
              )
            }
          />

          <InputField
            label="Business Location"
            icon={<MapPin size={17} />}
            value={settings.location}
            onChange={(value) =>
              updateSetting(
                "location",
                value
              )
            }
          />

          <SelectField
            label="Currency"
            icon={<IndianRupee size={17} />}
            value={settings.currency}
            onChange={(value) =>
              updateSetting(
                "currency",
                value
              )
            }
            options={[
              "INR",
              "USD",
              "EUR",
              "GBP",
            ]}
          />

        </div>

      </section>

      {/* ==================================================
          RENTAL SETTINGS
      ================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">

        <SectionHeader
          icon={<CalendarDays size={20} />}
          title="Rental Settings"
          description="Configure how customers can rent cars and bikes."
        />

        <div className="grid gap-5 p-6 md:grid-cols-2">

          <InputField
            label="Minimum Rental Duration"
            icon={<Clock3 size={17} />}
            value={settings.minRental}
            onChange={(value) =>
              updateSetting(
                "minRental",
                value
              )
            }
            type="number"
            suffix="days"
          />

          <InputField
            label="Maximum Rental Duration"
            icon={<Clock3 size={17} />}
            value={settings.maxRental}
            onChange={(value) =>
              updateSetting(
                "maxRental",
                value
              )
            }
            type="number"
            suffix="days"
          />

          <InputField
            label="Advance Booking Limit"
            icon={<CalendarDays size={17} />}
            value={settings.advanceBooking}
            onChange={(value) =>
              updateSetting(
                "advanceBooking",
                value
              )
            }
            type="number"
            suffix="days"
          />

          <InputField
            label="Late Return Fee"
            icon={<IndianRupee size={17} />}
            value={settings.lateFee}
            onChange={(value) =>
              updateSetting(
                "lateFee",
                value
              )
            }
            type="number"
            prefix="₹"
            suffix="/hour"
          />

        </div>

        <div className="border-t border-slate-100">

          <SettingRow
            icon={<Clock3 size={18} />}
            title="Allow Same-Day Booking"
            description="Allow customers to book a vehicle on the same day."
            enabled={settings.sameDayBooking}
            onChange={() =>
              updateSetting(
                "sameDayBooking",
                !settings.sameDayBooking
              )
            }
          />

          <SettingRow
            icon={<RefreshCw size={18} />}
            title="Automatic Vehicle Availability"
            description="Automatically mark vehicles unavailable when they are actively booked."
            enabled={settings.autoAvailability}
            onChange={() =>
              updateSetting(
                "autoAvailability",
                !settings.autoAvailability
              )
            }
          />

        </div>

      </section>

      {/* ==================================================
          VEHICLE MANAGEMENT
      ================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">

        <SectionHeader
          icon={<Car size={20} />}
          title="Vehicle Management"
          description="Configure cars and bikes in your GoWheels fleet."
        />

        <div className="grid gap-4 p-6 md:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-cyan-500 shadow-sm">
                <Car size={20} />
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Cars
                </p>

                <p className="text-xs text-slate-500">
                  Manage your car fleet from the Vehicles section.
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-cyan-500 shadow-sm">
                <Bike size={20} />
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Bikes
                </p>

                <p className="text-xs text-slate-500">
                  Manage your bike fleet from the Bikes section.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          BOOKING SETTINGS
      ================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">

        <SectionHeader
          icon={<CalendarDays size={20} />}
          title="Booking Settings"
          description="Control how customer bookings are processed."
        />

        <div className="border-t border-slate-100">

          <SettingRow
            icon={<CheckCircle2 size={18} />}
            title="Auto Confirm Bookings"
            description="Automatically confirm new bookings when a vehicle is available."
            enabled={settings.autoConfirm}
            onChange={() =>
              updateSetting(
                "autoConfirm",
                !settings.autoConfirm
              )
            }
          />

          <SettingRow
            icon={<ShieldCheck size={18} />}
            title="Require Admin Approval"
            description="Require an administrator to approve every new booking."
            enabled={settings.adminApproval}
            onChange={() =>
              updateSetting(
                "adminApproval",
                !settings.adminApproval
              )
            }
          />

          <SettingRow
            icon={<CalendarDays size={18} />}
            title="Allow Booking Cancellation"
            description="Allow customers to cancel their bookings."
            enabled={settings.allowCancellation}
            onChange={() =>
              updateSetting(
                "allowCancellation",
                !settings.allowCancellation
              )
            }
          />

          <SettingRow
            icon={<RefreshCw size={18} />}
            title="Allow Booking Modification"
            description="Allow customers to modify an existing booking."
            enabled={settings.allowModification}
            onChange={() =>
              updateSetting(
                "allowModification",
                !settings.allowModification
              )
            }
          />

        </div>

      </section>

      {/* ==================================================
          PAYMENT SETTINGS
      ================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">

        <SectionHeader
          icon={<CreditCard size={20} />}
          title="Payment Settings"
          description="Configure pricing, deposits and payment methods."
        />

        <div className="grid gap-5 p-6 md:grid-cols-2">

          <InputField
            label="Tax Percentage"
            icon={<IndianRupee size={17} />}
            value={settings.tax}
            onChange={(value) =>
              updateSetting(
                "tax",
                value
              )
            }
            type="number"
            suffix="%"
          />

          <InputField
            label="Security Deposit"
            icon={<IndianRupee size={17} />}
            value={settings.deposit}
            onChange={(value) =>
              updateSetting(
                "deposit",
                value
              )
            }
            type="number"
            prefix="₹"
          />

        </div>

        <div className="border-t border-slate-100">

          <SettingRow
            icon={<CreditCard size={18} />}
            title="Online Payments"
            description="Allow customers to pay online."
            enabled={settings.onlinePayment}
            onChange={() =>
              updateSetting(
                "onlinePayment",
                !settings.onlinePayment
              )
            }
          />

          <SettingRow
            icon={<IndianRupee size={18} />}
            title="Cash Payments"
            description="Allow customers to pay using cash."
            enabled={settings.cashPayment}
            onChange={() =>
              updateSetting(
                "cashPayment",
                !settings.cashPayment
              )
            }
          />

        </div>

      </section>

      {/* ==================================================
          NOTIFICATIONS
      ================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">

        <SectionHeader
          icon={<Bell size={20} />}
          title="Notifications"
          description="Choose which events should notify administrators."
        />

        <div className="border-t border-slate-100">

          <SettingRow
            icon={<CalendarDays size={18} />}
            title="New Booking"
            description="Notify administrators when a new booking is created."
            enabled={settings.newBooking}
            onChange={() =>
              updateSetting(
                "newBooking",
                !settings.newBooking
              )
            }
          />

          <SettingRow
            icon={<CalendarDays size={18} />}
            title="Booking Cancellation"
            description="Notify administrators when a booking is cancelled."
            enabled={settings.bookingCancellation}
            onChange={() =>
              updateSetting(
                "bookingCancellation",
                !settings.bookingCancellation
              )
            }
          />

          <SettingRow
            icon={<Bell size={18} />}
            title="New User Registration"
            description="Notify administrators when a new customer registers."
            enabled={settings.newUser}
            onChange={() =>
              updateSetting(
                "newUser",
                !settings.newUser
              )
            }
          />

          <SettingRow
            icon={<Car size={18} />}
            title="Vehicle Added"
            description="Notify administrators when a new vehicle is added."
            enabled={settings.vehicleAdded}
            onChange={() =>
              updateSetting(
                "vehicleAdded",
                !settings.vehicleAdded
              )
            }
          />

          <SettingRow
            icon={<AlertTriangle size={18} />}
            title="Important Admin Alerts"
            description="Receive important system and booking alerts."
            enabled={settings.adminAlerts}
            onChange={() =>
              updateSetting(
                "adminAlerts",
                !settings.adminAlerts
              )
            }
          />

        </div>

      </section>

      {/* ==================================================
          SECURITY
      ================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">

        <SectionHeader
          icon={<ShieldCheck size={20} />}
          title="Security"
          description="Protect your GoWheels administrator account."
        />

        <div className="grid gap-4 p-6 md:grid-cols-2">

          <button
            type="button"
            className="flex items-center gap-4 rounded-2xl border border-slate-200 p-5 text-left transition hover:border-cyan-300 hover:bg-cyan-50/40"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Lock size={20} />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                Change Password
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Update your administrator password.
              </p>
            </div>

          </button>

          <button
            type="button"
            className="flex items-center gap-4 rounded-2xl border border-slate-200 p-5 text-left transition hover:border-cyan-300 hover:bg-cyan-50/40"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Smartphone size={20} />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                Two-Factor Authentication
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Add another layer of security.
              </p>
            </div>

          </button>

        </div>

        <div className="border-t border-slate-100">

          <SettingRow
            icon={<Smartphone size={18} />}
            title="Two-Factor Authentication"
            description="Require an additional verification step when administrators log in."
            enabled={settings.twoFactor}
            onChange={() =>
              updateSetting(
                "twoFactor",
                !settings.twoFactor
              )
            }
          />

          <SettingRow
            icon={<ShieldCheck size={18} />}
            title="Login Alerts"
            description="Receive alerts when an administrator account is accessed."
            enabled={settings.loginAlerts}
            onChange={() =>
              updateSetting(
                "loginAlerts",
                !settings.loginAlerts
              )
            }
          />

        </div>

      </section>

      {/* ==================================================
          SYSTEM
      ================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">

        <SectionHeader
          icon={<Wrench size={20} />}
          title="System"
          description="Manage important GoWheels system controls."
        />

        <div className="border-t border-slate-100">

          <SettingRow
            icon={<Wrench size={18} />}
            title="Maintenance Mode"
            description="Temporarily disable customer access while performing maintenance."
            enabled={settings.maintenanceMode}
            onChange={() =>
              updateSetting(
                "maintenanceMode",
                !settings.maintenanceMode
              )
            }
            danger
          />

        </div>

        <div className="grid gap-4 border-t border-slate-100 p-6 md:grid-cols-2">

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 p-5">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Database size={20} />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                Database Status
              </p>

              <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                <CheckCircle2 size={13} />
                Connected
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 p-5 text-left transition hover:border-cyan-300 hover:bg-cyan-50/40"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <RefreshCw size={20} />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                Refresh Settings
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Reload the latest settings from database.
              </p>
            </div>

          </button>

        </div>

      </section>

      {/* ==================================================
          DANGER ZONE
      ================================================== */}

      <section className="rounded-3xl border border-red-200 bg-red-50/50">

        <div className="p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertTriangle size={20} />
            </div>

            <div>

              <h2 className="font-bold text-red-700">
                Danger Zone
              </h2>

              <p className="text-sm text-red-500">
                Actions in this section require extra care.
              </p>

            </div>

          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={17} />
              Logout Admin
            </button>

          </div>

        </div>

      </section>

      {/* ==================================================
          BOTTOM SAVE
      ================================================== */}

      <div className="flex justify-end">

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-300 disabled:opacity-60"
        >

          {saving ? (
            <>
              <RefreshCw
                size={18}
                className="animate-spin"
              />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save All Settings
            </>
          )}

        </button>

      </div>

    </div>
  );
}

// ======================================================
// SECTION HEADER
// ======================================================

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-slate-100 p-6">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
          {icon}
        </div>

        <div>

          <h2 className="font-bold text-slate-900">
            {title}
          </h2>

          <p className="text-sm text-slate-500">
            {description}
          </p>

        </div>

      </div>

    </div>
  );
}

// ======================================================
// SETTING ROW
// ======================================================

function SettingRow({
  icon,
  title,
  description,
  enabled,
  onChange,
  danger = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-slate-100 p-5 last:border-b-0">

      <div className="flex items-center gap-4">

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${danger
            ? "bg-red-50 text-red-500"
            : "bg-slate-50 text-slate-500"
            }`}
        >
          {icon}
        </div>

        <div>

          <p
            className={`text-sm font-semibold ${danger
              ? "text-red-700"
              : "text-slate-900"
              }`}
          >
            {title}
          </p>

          <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
            {description}
          </p>

        </div>

      </div>

      <Toggle
        enabled={enabled}
        onChange={onChange}
      />

    </div>
  );
}

// ======================================================
// INPUT FIELD
// ======================================================

function InputField({
  label,
  icon,
  value,
  onChange,
  type = "text",
  prefix,
  suffix,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">

        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        {prefix && (
          <span className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {prefix}
          </span>
        )}

        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white ${prefix
            ? "pl-16"
            : "pl-10"
            } ${suffix
              ? "pr-16"
              : "pr-4"
            }`}
        />

        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
            {suffix}
          </span>
        )}

      </div>

    </div>
  );
}

// ======================================================
// SELECT FIELD
// ======================================================

function SelectField({
  label,
  icon,
  value,
  onChange,
  options,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">

        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
        >

          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}

        </select>

      </div>

    </div>
  );
}