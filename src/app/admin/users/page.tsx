"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Users,
  Pencil,
  Trash2,
  Loader2,
  X,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  IndianRupee,
  ClipboardList,
} from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  created_at: string;

  booking_count: number;
  total_spent: number;
};

export default function AdminUsersPage() {
  // ======================================================
  // STATE
  // ======================================================

  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [deleteUser, setDeleteUser] =
    useState<User | null>(null);

  const [editUser, setEditUser] =
    useState<User | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  // ======================================================
  // FETCH USERS
  // ======================================================

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/users",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const responseText =
          await response.text();

        console.log(
          "Users API status:",
          response.status
        );

        console.log(
          "Users API response:",
          responseText
        );

        let data;

        try {
          data = JSON.parse(
            responseText
          );
        } catch {
          throw new Error(
            `API returned an invalid response (${response.status}).`
          );
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
            `Failed to fetch users. Status: ${response.status}`
          );
        }

        if (!data.success) {
          throw new Error(
            data.message ||
            "Failed to fetch users."
          );
        }

        setUsers(
          Array.isArray(data.users)
            ? data.users
            : []
        );
      } catch (error) {
        console.error(
          "Fetch users error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load users."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ======================================================
  // SEARCH
  // ======================================================

  const filteredUsers =
    users.filter((user) => {
      const searchText =
        search.toLowerCase();

      return (
        user.name
          .toLowerCase()
          .includes(searchText) ||
        user.email
          .toLowerCase()
          .includes(searchText) ||
        user.phone
          .toLowerCase()
          .includes(searchText) ||
        user.location
          .toLowerCase()
          .includes(searchText)
      );
    });

  // ======================================================
  // DELETE USER
  // ======================================================

  const handleDeleteUser =
    async () => {
      if (!deleteUser) return;

      try {
        setDeleting(true);

        const response =
          await fetch("/api/users", {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id: deleteUser.id,
            }),
          });

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            "Failed to delete user."
          );
        }

        setUsers(
          (currentUsers) =>
            currentUsers.filter(
              (user) =>
                user.id !==
                deleteUser.id
            )
        );

        setDeleteUser(null);
      } catch (error) {
        console.error(
          "Delete user error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to delete user."
        );
      } finally {
        setDeleting(false);
      }
    };

  // ======================================================
  // UPDATE USER
  // ======================================================

  const handleUpdateUser =
    async () => {
      if (!editUser) return;

      try {
        setSaving(true);

        const response =
          await fetch("/api/users", {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id: editUser.id,
              name: editUser.name,
              email: editUser.email,
              phone: editUser.phone,
              location:
                editUser.location,
            }),
          });

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            "Failed to update user."
          );
        }

        setUsers(
          (currentUsers) =>
            currentUsers.map(
              (user) =>
                user.id ===
                  editUser.id
                  ? editUser
                  : user
            )
        );

        setEditUser(null);
      } catch (error) {
        console.error(
          "Update user error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to update user."
        );
      } finally {
        setSaving(false);
      }
    };

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (
    date: string
  ) => {
    if (!date) return "N/A";

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            User Management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Users
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage GoWheels customers and
            their booking activity.
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
          <Users size={26} />
        </div>
      </div>

      {/* STATS */}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Total Users
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {users.length}
                </p>
              </div>

              <div className="rounded-xl bg-cyan-50 p-3 text-cyan-500">
                <Users size={21} />
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Total Bookings
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {users.reduce(
                    (total, user) =>
                      total +
                      Number(
                        user.booking_count ||
                        0
                      ),
                    0
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-500">
                <ClipboardList
                  size={21}
                />
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Total Revenue
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  ₹
                  {users
                    .reduce(
                      (total, user) =>
                        total +
                        Number(
                          user.total_spent ||
                          0
                        ),
                      0
                    )
                    .toLocaleString(
                      "en-IN"
                    )}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-3 text-green-500">
                <IndianRupee
                  size={21}
                />
              </div>

            </div>

          </div>

        </div>
      )}

      {/* SEARCH */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="relative">

          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search by name, email, phone or location..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
          />

        </div>

      </div>

      {/* LOADING */}

      {loading && (
        <div className="flex min-h-75 items-center justify-center rounded-3xl border border-slate-200 bg-white">

          <div className="flex items-center gap-3 text-slate-500">

            <Loader2
              size={22}
              className="animate-spin"
            />

            Loading users...

          </div>

        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

          <p className="font-semibold text-red-700">
            Failed to load users
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>

        </div>
      )}

      {/* TABLE */}

      {!loading && !error && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-275 text-left">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Location
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Bookings
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total Spent
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredUsers.map(
                  (user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* USER */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-4">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 font-bold text-cyan-600">
                            {user.name
                              ? user.name
                                .charAt(0)
                                .toUpperCase()
                              : "U"}
                          </div>

                          <div>

                            <p className="font-semibold text-slate-900">
                              {user.name ||
                                "Unknown User"}
                            </p>

                            <p className="text-xs text-slate-400">
                              ID #{user.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* CONTACT */}

                      <td className="px-6 py-4">

                        <div className="space-y-1">

                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail
                              size={14}
                              className="text-slate-400"
                            />

                            {user.email}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Phone
                              size={13}
                              className="text-slate-400"
                            />

                            {user.phone ||
                              "No phone"}
                          </div>

                        </div>

                      </td>

                      {/* LOCATION */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-sm text-slate-600">

                          <MapPin
                            size={15}
                            className="text-slate-400"
                          />

                          {user.location ||
                            "Not provided"}

                        </div>

                      </td>

                      {/* BOOKINGS */}

                      <td className="px-6 py-4">

                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">

                          {user.booking_count}

                        </span>

                      </td>

                      {/* TOTAL SPENT */}

                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">

                        ₹
                        {Number(
                          user.total_spent ||
                          0
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </td>

                      {/* JOINED */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-sm text-slate-500">

                          <CalendarDays
                            size={15}
                            className="text-slate-400"
                          />

                          {formatDate(
                            user.created_at
                          )}

                        </div>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          {/* EDIT */}

                          <button
                            type="button"
                            title="Edit user"
                            onClick={() =>
                              setEditUser(
                                user
                              )
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-cyan-400 hover:text-white"
                          >
                            <Pencil
                              size={17}
                            />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            title="Delete user"
                            onClick={() =>
                              setDeleteUser(
                                user
                              )
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2
                              size={17}
                            />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

                {filteredUsers.length ===
                  0 && (
                    <tr>

                      <td
                        colSpan={7}
                        className="px-6 py-16 text-center text-sm text-slate-500"
                      >
                        No users found.
                      </td>

                    </tr>
                  )}

              </tbody>

            </table>

          </div>

          {/* FOOTER */}

          <div className="border-t border-slate-200 px-6 py-4">

            <p className="text-sm text-slate-500">

              Showing{" "}

              <span className="font-semibold text-slate-900">
                {
                  filteredUsers.length
                }
              </span>

              {" "}of{" "}

              <span className="font-semibold text-slate-900">
                {users.length}
              </span>

              {" "}users

            </p>

          </div>

        </div>
      )}

      {/* ==================================================
          EDIT USER MODAL
      ================================================== */}

      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-wider text-cyan-500">
                  Customer
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Edit User
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setEditUser(null)
                }
                disabled={saving}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            <div className="mt-6 space-y-4">

              {/* NAME */}

              <div>

                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Name
                </label>

                <input
                  type="text"
                  value={
                    editUser.name
                  }
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-400 focus:bg-white"
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  value={
                    editUser.email
                  }
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-400 focus:bg-white"
                />

              </div>

              {/* PHONE */}

              <div>

                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Phone
                </label>

                <input
                  type="text"
                  value={
                    editUser.phone
                  }
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      phone: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-400 focus:bg-white"
                />

              </div>

              {/* LOCATION */}

              <div>

                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Location
                </label>

                <input
                  type="text"
                  value={
                    editUser.location
                  }
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      location:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-400 focus:bg-white"
                />

              </div>

            </div>

            <div className="mt-7 flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setEditUser(null)
                }
                disabled={saving}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleUpdateUser
                }
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-300 disabled:opacity-60"
              >

                {saving ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Pencil size={18} />
                    Save Changes
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}

      {/* ==================================================
          DELETE USER MODAL
      ================================================== */}

      {deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">

            <div className="flex items-start justify-between">

              <div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                  <Trash2 size={22} />
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-900">
                  Delete User?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">

                  Are you sure you want
                  to delete{" "}

                  <span className="font-semibold text-slate-900">
                    &quot;{deleteUser.name}&quot;
                  </span>
                  ?

                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Users with booking
                  records cannot be deleted.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setDeleteUser(null)
                }
                disabled={deleting}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            <div className="mt-7 flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setDeleteUser(null)
                }
                disabled={deleting}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleDeleteUser
                }
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >

                {deleting ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete User
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}