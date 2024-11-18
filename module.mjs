
export async function fetchInstagramData(iduser) {
  let followers = [];
  let followings = [];
  let dontFollowMeBack = [];

  try {
    console.log(`Process started! Give it a couple of seconds`);


    const userId = iduser;
    console.log(userId);

    let after = null;
    let has_next = true;

    // Fetch followers
    while (has_next) {
      const res = await fetch(
        `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=` +
        encodeURIComponent(
          JSON.stringify({
            id: userId,
            include_reel: true,
            fetch_mutual: true,
            first: 50,
            after: after,
          })
        )
      );
      const resJson = await res.json();

      has_next = resJson.data.user.edge_followed_by.page_info.has_next_page;
      after = resJson.data.user.edge_followed_by.page_info.end_cursor;

      followers = followers.concat(
        resJson.data.user.edge_followed_by.edges.map(({ node }) => ({
          username: node.username,
        }))
      );
    }


    after = null;
    has_next = true;

    // Fetch followings
    while (has_next) {
      const res = await fetch(
        `https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=` +
        encodeURIComponent(
          JSON.stringify({
            id: userId,
            include_reel: true,
            fetch_mutual: true,
            first: 50,
            after: after,
          })
        )
      );
      const resJson = await res.json();

      has_next = resJson.data.user.edge_follow.page_info.has_next_page;
      after = resJson.data.user.edge_follow.page_info.end_cursor;

      followings = followings.concat(
        resJson.data.user.edge_follow.edges.map(({ node }) => ({
          username: node.username,

        }))
      );
    }


    dontFollowMeBack = followings.filter((following) => {
      return !followers.find(
        (follower) => follower.username === following.username
      );
    });

    const filterdontfollowemeback = dontFollowMeBack.map((item) => {
      return {
        username: item.username,
        instagram_profile_link_who_unfollowed: `https://www.instagram.com/${item.username}`,
      };
    });


    localStorage.setItem('instagramData', JSON.stringify(filterdontfollowemeback))
    return filterdontfollowemeback.map(item =>
      `<tr>
         <td>${item.username}</td>
         <td><a href="${item.instagram_profile_link_who_unfollowed}" target="_blank"><button style=" border:none; color:black; border-radius:4px;  cursor:pointer; ">Link</button></a></td>
       </tr>`
    ).join('');

    // code for convert unfollowers data to cvs or excel
    // const csvData = jsonToCsvWithLinks(filterdontfollowemeback);
    // const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = 'employees_with_links.csv';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

  } catch (err) {

    localStorage.clear();
    return ` <tr>
    <td colspan="2"></td>${JSON.stringify({ error: err.message })}</tr>`;
  }
}

function jsonToCsvWithLinks(json) {
  const csvRows = [];
  const items = json;
  const header = Object.keys(items[0]);
  let csv = header.join(",") + "\n"; // Buat header CSV
  csvRows.join(csv);

  for (const row of items) {
    const values = header.map(header => { const escaped = row[header]; return `${escaped}`; });
    csvRows.push(values.join(';'));
  }
  return csvRows.join('\n');

}


