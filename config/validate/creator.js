export const createUserValidation = {
  name: {
    required: true,
    type: String,
    message: "Name is required",
  },
  email: {
    required: true,
    type: "email",
    message: "Valid email is required",
  },
  status: {
    required: false,
    type: String,
    default: "invited",
  },
  age: {
    required: false,
    type: String,
  },
  bio: {
    required: false,
    type: String,
  },
  country: {
    required: false,
    type: String,
  },
  address: {
    required: true,
    type: Object,
    schema: {
      city: {
        required: true,
        type: String,
      },
      postalCode: {
        required: true,
        type: String,
      },
      state: {
        required: true,
        type: String,
      },
      street: {
        required: true,
        type: String,
      },
    },
  },
  measurements: {
    required: true,
    type: Object,
    schema: {
      height: {
        required: true,
        type: String,
      },
      weight: {
        required: true,
        type: String,
      },
      dressSize: {
        required: true,
        type: String,
      },
      shoeSize: {
        required: true,
        type: String,
      },
      waist: {
        required: true,
        type: String,
      },
      hips: {
        required: true,
        type: String,
      },
    },
  },
};
