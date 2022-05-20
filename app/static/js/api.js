const login_api = async (username, password, success, fail) => {
  const response = await fetch(
        `/api/token/`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "username": username,
              "password": password,
            })
        }
    );
  const text = await response.text();
  if (response.status === 200) {
    console.log("success", JSON.parse(text));
    success(JSON.parse(text));
  } else {
    console.log("failed", text);
    Object.entries(JSON.parse(text)).forEach(([key, value])=>{
      fail(`${key}: ${value}`);
    });
  }
};

const get_geolocations_api = async (pageNo="", success, fail) => {
  const token = await localStorage.getItem("loginToken");
  if (token === null) {
    console.log("No credentials found, redirecting...");
    window.location = "/login";
    return [];
  }
  const response = await fetch(
        `/api/geolocations/?page_no=${pageNo}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/JSON',
                'Authorization': `Bearer ${token}`,
            }
        }
    );
  const text = await response.text();
  if (response.status === 401) {
    console.log("Token not valid");
    window.location = "/login";
    return [];
  }
  if (response.status === 200) {
    console.log("success", JSON.parse(text));
    success(JSON.parse(text));
  } else {
    console.log("failed", text);
    Object.entries(JSON.parse(text)).forEach(([key, value])=>{
      fail(`${key}: ${value}`);
    });
  }
};

const post_geolocation_api = async (data, success) => {
  const token = await localStorage.getItem("loginToken");
  if (token === null) {
    console.log("No credentials found, redirecting...");
    window.location = "/login";
    return [];
  }
  const response = await fetch(
        `/api/geolocations/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/JSON',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        }
    );
  const text = await response.text();
  if (response.status === 401) {
    console.log("Token not valid");
    window.location = "/login";
    return [];
  }
  if (response.status === 201) {
    console.log("success", JSON.parse(text));
    success(JSON.parse(text));
  } else {
    console.log("failed", text);
    Object.entries(JSON.parse(text)).forEach(([key, value])=>{
      fail(`${key}: ${value}`);
    });
  }
};

