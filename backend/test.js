const signupUser = async () => {
  try {
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'tazino',
        email: 'bello'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Signup successful:', data);
    return data;
  } catch (error) {
    console.error('Signup failed:', error);
    throw error;
  }
};

// Call the function
signupUser();