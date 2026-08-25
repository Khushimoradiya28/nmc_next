const axios = require("axios");

exports.sendOtp = async (mobile, otp) => {
  try {
    const url =
      "https://api.msg91.com/api/sendhttp.php?sender=MIDNIG" +
      "&route=4" +
      "&authkey=373004AUmbyrJp6629f2828P1" +
      "&message=" +
      encodeURIComponent(
        `Your OTP for login to midnight application is ${otp}. Valid for 5min. Please do not share this OTP.\nRegards,\nMidnight Team`
      ) +
      "&mobiles=91" +
      mobile +
      "&DLT_TE_ID=1207165460549838285";

    await axios.post(url, {}, {
      headers: {
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmM3YjgzNjZkMGVlNWQ0NTNjZTM4MzQiLCJpYXQiOjE2NTk0MTUwOTd9.LQFWzT06MsLucJ8Xd3YjLmPHro2LQYO1di5RI8btpV4",
        Cookie: "PHPSESSID=j2gm1pieo7nvnpcbf3u7ubtjs7",
      }
    });

    return true;
  } catch (error) {
    // next(error); // Removed: next is not defined here
    throw error;
  }
};
