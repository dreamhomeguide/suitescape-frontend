// noinspection JSCheckFunctionSignatures

import Ionicons from "@expo/vector-icons/Ionicons";
import React, { createContext, useContext, useMemo, useReducer } from "react";
import { useToast } from "react-native-toast-notifications";

import { useListingContext } from "./ListingContext";
import toastStyles from "../assets/styles/toastStyles";

const initialState = {
  listings: {},
  isEditing: false,
  isVisible: false,
};

const initialCartListingState = {
  listingData: {},
  cart: [],
  reserved: [],
  selected: [],
  archived: [],
  addons: [],
  total: 0,
  addonsTotal: 0,
  reservedTotal: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "OPEN_CART":
      return {
        ...state,
        isVisible: true,
      };
    case "CLOSE_CART":
      return {
        ...state,
        isVisible: false,
        isEditing: false,
        // selected: [],
      };
    case "TOGGLE_EDITING":
      return {
        ...state,
        isEditing: !state.isEditing,
        // selected: [],
      };
    case "REFRESH_ALL": {
      const { listingId, rooms } = action.payload;
      const listing = state.listings[listingId];
      if (!listing) return state;

      let newTotal = 0;
      const newCart = listing.cart.map((item) => {
        const room = rooms.find((room) => room.id === item.id);
        if (!room) return item;

        newTotal += room.price * item.quantity;
        return { ...item, price: room.price };
      });

      const newListing = {
        ...listing,
        cart: newCart,
        total: newTotal,
      };

      return {
        ...state,
        listings: {
          ...state.listings,
          [listingId]: newListing,
        },
      };
    }
    case "UPDATE_QUANTITY": {
      const { listingId, roomId, newQuantity } = action.payload;
      const listing = state.listings[listingId];
      if (!listing) return state;

      let newTotal = 0;
      const newCart = listing.cart.map((item) => {
        if (item.id === roomId) {
          newTotal += item.price * newQuantity;
          return { ...item, quantity: newQuantity };
        } else {
          newTotal += item.price * item.quantity;
          return item;
        }
      });

      const newListing = {
        ...listing,
        cart: newCart,
        total: newTotal,
      };

      return {
        ...state,
        listings: {
          ...state.listings,
          [listingId]: newListing,
        },
      };
    }
    case "ADD_OR_UPDATE_ADDON": {
      const { listingId, addonData } = action.payload;
      const listing = state.listings[listingId] || initialCartListingState;

      let newTotal = 0;
      let addonExists = false;

      const newAddons = listing.addons.reduce((acc, item) => {
        if (item.id === addonData.id) {
          addonExists = true;

          // Remove the addon if the new quantity is 0
          if (addonData.quantity > 0) {
            newTotal += addonData.price * addonData.quantity;
            acc.push({ ...item, quantity: addonData.quantity });
          }
        } else {
          newTotal += item.price * item.quantity;
          acc.push(item);
        }
        return acc;
      }, []);

      // Add new addon, but only if the new quantity is not 0
      if (!addonExists && addonData.quantity > 0) {
        const newAddonItem = {
          id: addonData.id,
          name: addonData.name,
          price: addonData.price,
          maxQuantity: addonData.maxQuantity,
          quantity: addonData.quantity,
        };
        newAddons.push(newAddonItem);
        newTotal += addonData.price * addonData.quantity;
      }

      const newListing = {
        ...listing,
        addons: newAddons,
        addonsTotal: newTotal,
      };

      return {
        ...state,
        listings: {
          ...state.listings,
          [listingId]: newListing,
        },
      };
    }
    case "ADD_ITEM": {
      const { listingData, roomData } = action.payload;
      const listing = state.listings[listingData.id] || initialCartListingState;

      const newCartItem = {
        id: roomData.id,
        name: roomData.name,
        price: roomData.price,
        maxQuantity: roomData.maxQuantity,
        quantity: 1,
      };

      const newListing = {
        ...listing,
        listingData: {
          id: listingData.id,
          name: listingData.name,
          image: listingData.image,
        },
        cart: [newCartItem, ...listing.cart],
        total: listing.total + roomData.price,
      };

      return {
        ...state,
        listings: {
          ...state.listings,
          [listingData.id]: newListing,
        },
      };
    }
    case "REMOVE_ITEM": {
      const { listingId, roomId } = action.payload;
      const listing = state.listings[listingId];
      if (!listing) return state;

      const newCart = [];
      let newTotal = listing.total;

      listing.cart.forEach((item) => {
        if (item.id === roomId) {
          newTotal -= item.price * item.quantity;
        } else {
          newCart.push(item);
        }
      });

      const newListing = {
        ...listing,
        cart: newCart,
        total: newTotal,
      };

      return {
        ...state,
        listings: {
          ...state.listings,
          [listingId]: newListing,
        },
      };
    }
    case "REMOVE_SELECTED": {
      const { listingId } = action.payload;
      const listing = state.listings[listingId];
      if (!listing) return state;

      const newCart = [];
      const selectedSet = new Set(listing.selected);
      let newTotal = listing.total;

      listing.cart.forEach((item) => {
        if (selectedSet.has(item.id)) {
          newTotal -= item.price * item.quantity;
        } else {
          newCart.push(item);
        }
      });

      const newListing = {
        ...listing,
        cart: newCart,
        total: newTotal,
        selected: [],
      };

      return {
        ...state,
        listings: {
          ...state.listings,
          [listingId]: newListing,
        },
      };
    }
    case "SELECT_ITEM": {
      const { listingId, roomId } = action.payload;
      const listing = state.listings[listingId];
      if (!listing) return state;

      let newListing;
      if (listing.selected.includes(roomId)) {
        newListing = {
          ...listing,
          selected: listing.selected.filter((id) => id !== roomId),
        };
      } else {
        newListing = {
          ...listing,
          selected: [roomId, ...listing.selected],
        };
      }

      return {
        ...state,
        listings: {
          ...state.listings,
          [listingId]: newListing,
        },
      };
    }
    case "SELECT_ALL": {
      const { listingId } = action.payload;
      const listing = state.listings[listingId];
      if (!listing) return state;

      const newListing = {
        ...listing,
        selected: listing.cart.map((item) => item.id),
      };

      return {
        ...state,
        listings: {
          ...state.listings,
          [listingId]: newListing,
        },
      };
    }
    case "UNSELECT_ALL": {
      const { listingId } = action.payload;
      const listing = state.listings[listingId];
      if (!listing) return state;

      const newListing = {
        ...listing,
        selected: [],
      };

      return {
        ...state,
        listings: {
          ...state.listings,
          [listingId]: newListing,
        },
      };
    }
    case "RESERVE_SELECTED": {
      const { listingId } = action.payload;
      const listing = state.listings[listingId];
      if (!listing) return state;

      const selectedSet = new Set(listing.selected);
      let newTotal = 0;

      const newReserved = listing.cart.reduce((acc, item) => {
        if (selectedSet.has(item.id)) {
          newTotal += item.price * item.quantity;
          return [item, ...acc];
        }
        return acc;
      }, []);

      const newListing = {
        ...listing,
        reserved: newReserved,
        reservedTotal: newTotal,
      };

      return {
        ...state,
        listings: {
          ...state.listings,
          [listingId]: newListing,
        },
      };
    }
    case "RESERVE_ALL": {
      const { listingId } = action.payload;
      const listing = state.listings[listingId];
      if (!listing) return state;

      const newListing = {
        ...listing,
        reserved: [...listing.cart],
        reservedTotal: listing.total,
      };

      return {
        ...state,
        listings: {
          ...state.listings,
          [listingId]: newListing,
        },
      };
    }
    case "REMOVE_ARCHIVED": {
      const { listingId, roomId } = action.payload;
      const listing = state.listings[listingId];
      if (!listing) return state;

      const newListing = {
        ...listing,
        archived: listing.archived.filter((item) => item.id !== roomId),
      };

      return {
        ...state,
        listings: {
          ...state.listings,
          [listingId]: newListing,
        },
      };
    }
    case "REMOVE_ALL_ARCHIVED": {
      const { listingId } = action.payload;
      const listing = state.listings[listingId];
      if (!listing) return state;

      const newListing = {
        ...listing,
        archived: [],
      };

      return {
        ...state,
        listings: {
          ...state.listings,
          [listingId]: newListing,
        },
      };
    }
    case "ARCHIVE_ALL": {
      const { listingId } = action.payload;
      const listing = state.listings[listingId];
      if (!listing) return state;

      const combinedItems = [...listing.cart, ...listing.archived];
      const uniqueMap = new Map();

      combinedItems.forEach((item) => {
        if (!uniqueMap.has(item.id)) {
          uniqueMap.set(item.id, item);
        }
      });

      const newListing = {
        ...listing,
        archived: Array.from(uniqueMap.values()),
        cart: [],
        total: 0,
      };

      return {
        ...state,
        listings: {
          ...state.listings,
          [listingId]: newListing,
        },
      };
    }
    case "CLEAR_CART": {
      const { listingId } = action.payload;
      const listing = state.listings[listingId];
      if (!listing) return state;

      return {
        ...state,
        listings: {
          ...state.listings,
          [listingId]: initialCartListingState,
        },
      };
    }
    case "CLEAR_ALL_CART":
      return {
        ...state,
        listings: {},
      };
    default:
      return state;
  }
};

export const CartContext = createContext({
  cartState: initialState,
  openCart: () => {},
  closeCart: () => {},
  toggleEditing: () => {},
  refreshAll: ({ _listingId, _rooms }) => {},
  updateQuantity: ({ _listingId, _roomId, _newQuantity }) => {},
  addOrUpdateAddon: ({ _listingId, _addonData }) => {},
  addItem: ({ _listingData, _roomData }) => {},
  removeItem: ({ _listingId, _roomId }) => {},
  removeSelected: ({ _listingId }) => {},
  selectItem: ({ _listingId, _roomId }) => {},
  selectAll: ({ _listingId }) => {},
  unselectAll: ({ _listingId }) => {},
  reservedSelected: ({ _listingId }) => {},
  reserveAll: ({ _listingId }) => {},
  removeArchived: ({ _listingId, _roomId }) => {},
  removeAllArchived: ({ _listingId }) => {},
  archiveAll: ({ _listingId }) => {},
  clearCart: ({ _listingId }) => {},
  clearAllCart: () => {},
});

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);

  const toast = useToast();

  const actions = {
    openCart: () => dispatch({ type: "OPEN_CART" }),
    closeCart: () => dispatch({ type: "CLOSE_CART" }),
    toggleEditing: () => dispatch({ type: "TOGGLE_EDITING" }),
    refreshAll: (payload) => dispatch({ type: "REFRESH_ALL", payload }),
    updateQuantity: (payload) => dispatch({ type: "UPDATE_QUANTITY", payload }),
    addOrUpdateAddon: (payload) =>
      dispatch({ type: "ADD_OR_UPDATE_ADDON", payload }),
    addItem: (payload) => {
      dispatch({ type: "ADD_ITEM", payload });
      toast.show("Added to cart", {
        type: "success",
        placement: "top",
        style: toastStyles.toastInsetHeader,
        icon: <Ionicons name="cart" size={20} color="white" />,
      });
    },
    removeItem: (payload) => {
      dispatch({ type: "REMOVE_ITEM", payload });
      toast.show("Removed from cart", {
        type: "danger",
        placement: "top",
        style: toastStyles.toastInsetHeader,
        icon: <Ionicons name="cart" size={20} color="white" />,
      });
    },
    removeSelected: (payload) => dispatch({ type: "REMOVE_SELECTED", payload }),
    selectItem: (payload) => dispatch({ type: "SELECT_ITEM", payload }),
    selectAll: (payload) => dispatch({ type: "SELECT_ALL", payload }),
    unselectAll: (payload) => dispatch({ type: "UNSELECT_ALL", payload }),
    reservedSelected: (payload) =>
      dispatch({ type: "RESERVE_SELECTED", payload }),
    reserveAll: (payload) => dispatch({ type: "RESERVE_ALL", payload }),
    removeArchived: (payload) => dispatch({ type: "REMOVE_ARCHIVED", payload }),
    removeAllArchived: (payload) =>
      dispatch({ type: "REMOVE_ALL_ARCHIVED", payload }),
    archiveAll: (payload) => dispatch({ type: "ARCHIVE_ALL", payload }),
    clearCart: (payload) => dispatch({ type: "CLEAR_CART", payload }),
    clearAllCart: () => dispatch({ type: "CLEAR_ALL_CART" }),
  };

  const cartContext = {
    cartState: state,
    ...actions,
  };

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
};

export const useActiveCarts = () => {
  const { cartState } = useCartContext();
  // const { settings } = useSettings();

  return useMemo(() => {
    // // If guest mode is enabled, return an empty array
    // if (settings.guestModeEnabled) {
    //   return [];
    // }

    // Filter out listings with no items in cart
    return Object.values(cartState.listings).filter(
      (listing) => listing.cart.length > 0,
    );
  }, [cartState.listings]);
};

export const useExpiredCarts = () => {
  const { cartState } = useCartContext();

  return useMemo(
    () =>
      Object.values(cartState.listings).filter(
        (listing) => listing.archived.length > 0,
      ),
    [cartState.listings],
  );
};

export const useCartData = () => {
  const { cartState } = useCartContext();
  const { listing } = useListingContext();

  return useMemo(
    () => cartState.listings[listing?.id] || initialCartListingState,
    [cartState.listings, listing?.id],
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
