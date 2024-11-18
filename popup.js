import { fetchInstagramData } from './module.mjs';
const myprofile = document.getElementById("my-profile");
const searchprofile = document.getElementById('search-profile');
const otherprofile = document.getElementById("other-profile");
const username = document.getElementById("datausername");
const back = document.getElementById("back");
const table = document.getElementById("table");
const showdata = document.getElementById("showdata");
const formsearch = document.getElementById("form-search");


formsearch.addEventListener("submit", async (e) => {
  e.preventDefault();
  table.style.height = "auto";
  formsearch.style.height = "0px";
  formsearch.style.height = "0px";
  table.style.marginTop = "10px";


  showdata.innerHTML = `
    <tr>
      <td colspan="2">
  
          <div class="loader-inner">
              <div class="loader-line-wrap">
                  <div class="loader-line"></div>
              </div>
              <div class="loader-line-wrap">
                  <div class="loader-line"></div>
              </div>
              <div class="loader-line-wrap">
                  <div class="loader-line"></div>
              </div>
              <div class="loader-line-wrap">
                  <div class="loader-line"></div>
              </div>
              <div class="loader-line-wrap">
                  <div class="loader-line"></div>
              </div>
          </div>
      </td>
  </tr>
  `;


  const data = await fetchInstagramData(e.submitter.attributes[2].nodeValue);
  showdata.innerHTML = data;
})



myprofile.addEventListener('click', async () => {


  showdata.innerHTML = `
  <tr>
    <td colspan="2">

        <div class="loader-inner">
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
        </div>
    </td>
</tr>
`;

  try {
    const instagramscrap = await fetch('https://www.instagram.com/accounts/notifications/').then(response => { return response.text() });
    const iduserprofile = instagramscrap.match(/"id":"(\d+)"/);

    const data = await fetchInstagramData(iduserprofile[1]);
    showdata.innerHTML = data;

  } catch (err) {

    showdata.innerHTML = ` <tr>
    <td colspan="2"></td>${JSON.stringify({ error: err.message })}</tr>`;
  }


});

window.addEventListener("load", () => {
  const storedData = localStorage.getItem('instagramData');
  if (storedData) {
    const data = JSON.parse(storedData); // Parse the JSON string into an object/array

    const filterdontfollowemeback = data.map((item) => {
      return {
        username: item.username,
        instagram_profile_link_who_unfollowed: `https://www.instagram.com/${item.username}`
      };
    });

    const htmlContent = filterdontfollowemeback.map(item =>
      `<tr >
         <td>${item.username}</td>
         <td><a href="${item.instagram_profile_link_who_unfollowed}" target="_blank"><button style=" border:none; color:black; border-radius:4px;  cursor:pointer; ">Link</button></a></td>
       </tr>`
    ).join('');

    showdata.innerHTML = htmlContent; // Set the formatted HTML
  }
});


username.addEventListener('input', async (e) => {
  document.getElementById("showdata-search").innerHTML = `
  <tr>
    <td colspan="2">

        <div class="loader-inner">
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
        </div>
    </td>
</tr>
`;


  try {


    const username = e.target.value;
    const userQueryRes = await fetch(
      `https://www.instagram.com/web/search/topsearch/?query=${username}`
    );

    const userQueryJson = await userQueryRes.json();




    const usernamequery = userQueryJson.users.map((item) => {
      return `<tr > <td  ><button class="listhover" style="color:white; width: 100%; background-color:transparent; border:none; cursor:pointer" id="${item.user.pk}" type="submit" >${item.user.username}</button></td></tr>`;
    });

    document.getElementById("showdata-search").innerHTML = "";

    usernamequery.forEach(element => {
      document.getElementById("showdata-search").innerHTML += element;

    });
  } catch (err) {
    showdata.innerHTML = ` <tr>
  <td colspan="2"></td>${JSON.stringify({ error: err.message })}</tr>`;
  }

})

otherprofile.addEventListener("click", () => {
  otherprofile.style.display = "none";
  myprofile.style.display = "none";
  searchprofile.style.height = "32px";
  back.style.display = "block";
  table.style.height = "0px";
  table.style.marginTop = "0px";
  formsearch.style.height = "auto";
})

back.addEventListener("click", () => {
  back.style.display = "none";
  otherprofile.style.display = "block";
  myprofile.style.display = "block";
  searchprofile.style.height = "0px";
  table.style.height = "auto";
  table.style.marginTop = "0px";
  formsearch.style.height = "0px";

});
