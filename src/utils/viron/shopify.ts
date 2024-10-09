export const addToCart = async (checkoutId: string, variantId: string, quantity: number) => {
  // Define the payload

  const payload = new URLSearchParams({
    change_id: checkoutId,
    id: variantId,
    quantity: quantity.toString(), // Ensure quantity is a string
    properties: {
      'My Custom Property': 'Value',
    },
  }).toString();

  // Make the POST request using fetch with credentials
  fetch('https://viron-world.com/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: payload,
    credentials: 'include', // This will include cookies in the request
  })
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => {
      console.log('Success:', data); // Log the response data
    })
    .catch((error) => {
      console.error('Error:', error); // Log any error
    });
};

export const getCartToken = async () => {
  // Make the GET request using fetch with credentials
  return fetch('https://viron-world.com/cart.js', {
    method: 'GET',
    credentials: 'include', // This will include cookies in the request
  })
    .then((response) => response.json())
    .then((data) => {
      console.debug('getCartToken:', data);
      return data['token'];
    })
    .catch((error) => {
      console.error('GetCartToken Error:', error);
    });
};
