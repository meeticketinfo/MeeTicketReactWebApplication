import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiService from "../services/apiService"; // Adjust with your API service setup
import sidebarItems from "../partials/sidebarItems";

const LOGIN_API_ENDPOINT = "/Authentication/login";
const DECODED_TOKEN_ENDPOINT = "/Authentication/GetDecodedToken";
const GET_ALL_ROLES = "/Master/GetAllRoles";

const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoading: false,
      isAuthenticated: false,
      token: null,
      loginError: "",
      error: null,
      decodedTokenData: null,
      userRoles: [],
      roleDetails: null, // To store role id and name
      sidebarMenuItems: [], // To store filtered sidebar items

      login: async (loginData) => {
        set({ isLoading: true });
        try {
          const response = await apiService.post(LOGIN_API_ENDPOINT, loginData);
          const token = response.data;
          set({ token, error: null, isLoading: false, isAuthenticated: true });

          // Fetch decoded token data and roles upon successful login
          await get().fetchDecodedToken();
          await get().fetchUserRoles();

          // Set sidebar items after role is fetched
          get().setSidebarMenuItems();

          return { success: true };
        } catch (error) {
          set({
            // loginError: error?.response?.data?.message,
            error: error?.response?.data?.message,
            isLoading: false,
          });
          throw error;
          //   return { success: false, error: error };
        }
      },

      fetchDecodedToken: async () => {
        try {
          const response = await apiService.get(DECODED_TOKEN_ENDPOINT);
          set({ decodedTokenData: response.data, error: null });
        } catch (error) {
          set({ error: error.message });
        }
      },

      fetchUserRoles: async () => {
        try {
          const response = await apiService.get(GET_ALL_ROLES);
          const roles = response.data;
          set({ userRoles: roles, error: null });

          // Find role details based on decoded token roleId
          const roleId = get().decodedTokenData?.data?.RoleId;
          const roleDetails = roles.find((role) => role.id === roleId);
          if (roleDetails) {
            set({ roleDetails });
          }
        } catch (error) {
          set({ error: error.message });
        }
      },

      setSidebarMenuItems: () => {
        const { roleDetails } = get();
        const permissions = {
          ROLE_ADMIN: ["dashboard", "park-management", "park-admin-management"],
          ROLE_USER: ["facilites", "service", "service-varient"],
          ROLE_SUPERADMIN: [
            "dashboard",
            "park-management",
            "park-admin-management",
            "bookings",
          ],
          ROLE_GATEKEEPER: ["entry-scan-users", "holidays"],
        };

        const allowedPaths = permissions[roleDetails?.name] || [];

        // Filter sidebar items based on allowed paths and retain icon and gradientClass
        const filteredSidebarItems = sidebarItems
          .map((item) => {
            if (item.subItems.length > 0) {
              const filteredSubItems = item.subItems.filter((subItem) =>
                allowedPaths.includes(subItem.path.substring(1))
              );
              // Only return items with non-empty subItems
              return filteredSubItems.length > 0
                ? { ...item, subItems: filteredSubItems }
                : null;
            }
            // Include top-level items if their path is allowed
            return allowedPaths.includes(item.path.substring(1)) ? item : null;
          })
          .filter(Boolean); // Remove null entries

        set({ sidebarMenuItems: filteredSidebarItems });
      },

      logout: () =>
        set({
          token: null,
          error: null,
          isAuthenticated: false,
          decodedTokenData: null,
          roleDetails: null,
          sidebarMenuItems: [],
        }),
    }),
    {
      name: "auth-store",
      getStorage: () => localStorage,
      //   partialize: (state) => ({
      //     token: state.token,
      //     isAuthenticated: state.isAuthenticated,
      //     decodedTokenData: state.decodedTokenData,
      //   }),
    }
  )
);

export default useAuthStore;
