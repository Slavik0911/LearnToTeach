// ============================
// SHARED BASE STYLES
// ============================

// Shared transition
export const uiTransition =
  "transition-all duration-300";

// Shared rounded styles
export const roundedFull =
  "rounded-full";

export const rounded2xl =
  "rounded-2xl";

// Shared input/button border
export const uiBorder =
  "border-2";

// Shared focus/outline reset
export const uiOutline =
  "outline-none";

// Shared disabled state
export const uiDisabled =
  "disabled:opacity-60";

// Shared full width
export const fullWidth =
  "w-full";

// Shared auth width
export const authWidth =
  "w-[320px] max-w-full";

// Shared flex center
export const flexCenter =
  "flex items-center justify-center";

// Shared hover/active press effect
export const pressable =
  "active:scale-[0.99]";

// Shared gray field background
export const grayField =
  "bg-gray";



// ============================
// AUTH FORM STYLES
// ============================

// Input used in Login / SignUp / ForgotPassword forms
export const authInput =
  `${authWidth} ${roundedFull} bg-gray-200 px-6 py-3 text-xl text-black ${uiOutline} placeholder:text-gray-600 ${uiTransition} focus:ring-2 focus:ring-navy/40`;

// Main submit button in auth forms
export const authSubmitBtn =
  `${authWidth} ${roundedFull} bg-navy py-3 text-2xl text-white ${uiTransition} ${pressable} ${uiDisabled}`;

// Google authentication button
export const authGoogleBtn =
  `${authWidth} ${flexCenter} gap-3 ${roundedFull} border-2 border-gray-300 bg-white py-3 text-lg font-medium text-gray-700 ${uiTransition} hover:bg-gray-50 ${pressable} ${uiDisabled}`;

// Auth links (Sign up / Log in)
export const authLink =
  "text-blue-500 hover:underline";

// Secondary text under auth forms
export const authSecondaryText =
  "pt-1 text-lg text-gray-800";

// Divider between auth methods
export const authDivider =
  `${authWidth} flex items-center gap-3`;

export const authDividerLine =
  "h-px flex-1 bg-gray-300";

export const authDividerText =
  "text-lg text-gray-500";


// ============================
// ADMIN LESSON FORM STYLES
// ============================

// Shared form field base used in AddLesson and modals
export const formFieldBase =
  `${rounded2xl} ${uiBorder} ${uiOutline} ${uiTransition} ${grayField} hover:bg-lightblue/20 focus:border-lightblue focus:bg-white`;

// Standard form input used in AddLesson
export const formInput = (hasError = false) =>
  `${formFieldBase} p-5 w-full mb-4 text-2xl ${
    hasError ? "border-red-500" : "border-transparent"
  }`;

// Textarea used for lesson description
export const formTextarea = (hasError = false) =>
  `${formFieldBase} p-5 w-full mb-4 text-xl resize-none ${
    hasError ? "border-red-500" : "border-transparent"
  }`;


// ============================
// TOGGLE BUTTONS (AGE / LEVEL)
// ============================

// Base button for selecting options
export const selectButtonBase =
  `text-2xl ${rounded2xl} p-4 w-full ${uiBorder} ${uiTransition} hover:scale-[1.02] active:scale-[0.99]`;

// Age selector buttons
export const selectButton = (isActive = false, hasError = false) =>
  `${selectButtonBase} ${
    hasError ? "border-red-500" : "border-transparent"
  } ${
    isActive
      ? "bg-lightblue shadow-md"
      : "bg-gray hover:bg-lightblue/70 hover:shadow-md"
  }`;

// Base button for CEFR level selection
export const levelButtonBase =
  `text-2xl ${rounded2xl} p-4 w-full ${uiBorder} ${uiTransition} hover:scale-[1.03] active:scale-[0.98]`;

// Level selector buttons
export const levelButton = (isActive = false, hasError = false) =>
  `${levelButtonBase} ${
    hasError ? "border-red-500" : "border-transparent"
  } ${
    isActive
      ? "bg-lightblue shadow-md"
      : "bg-gray hover:bg-lightblue/70 hover:shadow-md"
  }`;


// ============================
// LESSON IMAGE UPLOAD STYLES
// ============================

// Image preview card
export const imageCard =
  `group relative h-40 overflow-hidden ${rounded2xl} border-2 border-transparent bg-gray ${uiTransition} hover:-translate-y-1 hover:shadow-xl`;

// Preview image inside card
export const imagePreview =
  "h-full w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-110";

// Overlay shown on hover
export const imageOverlay =
  "pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10";

// Delete button on image
export const imageDeleteBtn =
  "absolute top-2 right-2 rounded-full bg-white/90 p-2 text-black shadow-md transition-all duration-300 hover:scale-110 hover:bg-red-500 hover:text-white active:scale-95";

// Button for adding new images
export const imageAddButton = (hasError = false) =>
  `h-40 ${rounded2xl} border-2 flex items-center justify-center ${uiTransition} hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] ${
    hasError
      ? "border-red-500 bg-lightblue"
      : "border-transparent bg-lightblue hover:bg-lightblue/80"
  }`;

// Plus icon animation
export const plusIcon =
  "transition-transform duration-300 hover:rotate-90";


// Save button used in admin panels
export const saveButton =
  `mt-4 w-full ${rounded2xl} bg-navy p-4 text-2xl text-white ${uiTransition} hover:-translate-y-0.5 hover:shadow-xl hover:opacity-95 active:scale-[0.99] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none`;


// ============================
// MODAL SYSTEM
// ============================

// Background overlay
export const modalOverlay =
  "absolute inset-0 bg-black/40";

// Modal container
export const modalPanel =
  `relative ${rounded2xl} bg-white shadow-xl`;

// Modal title
export const modalTitle =
  "text-3xl font-semibold";

// Modal description text
export const modalText =
  "mt-2 text-lg opacity-80";

// Modal button container
export const modalActions =
  "mt-6 flex justify-end gap-3";

// Base modal button
export const modalBtn =
  `${rounded2xl} px-5 py-3 text-xl transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg active:scale-[0.97] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:active:scale-100`;

// Primary modal button
export const modalBtnPrimary =
  "bg-navy text-white";

// Danger modal button
export const modalBtnDanger =
  "bg-red-600 text-white";

// Secondary modal button
export const modalBtnSecondary =
  "bg-gray text-black";

// Base input inside modal
export const modalInputBase =
  `${rounded2xl} w-full px-5 py-3 text-xl ${uiBorder} border-gray ${uiOutline} ${uiTransition} bg-gray hover:bg-lightblue/20 focus:border-lightblue focus:bg-white disabled:opacity-50`;

// Input inside modal with error styling
export const modalInputError = (hasError = false) =>
  `${modalInputBase} ${hasError ? "border-red-500" : "border-transparent"}`;

// Scrollable modal content
export const modalContentBox =
  `mt-6 max-h-[400px] overflow-auto ${rounded2xl} bg-gray p-6`;