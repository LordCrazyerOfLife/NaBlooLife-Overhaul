      function yt2006Signup(e, t, a, o = "up") {
        const n = (state.emails || []).filter((e) => !e.hacked),
          s = socYear();
        (sTitle.textContent = "YOUTUBE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial);
        const r = n
            .map((e) => `<option${e.addr === t ? " selected" : ""}>${escAttr(e.addr)}</option>`)
            .join(""),
          i = Object.entries(window.COUNTRIES || {})
            .map(([e, [t]]) => [e, t])
            .sort((e, t) => e[1].localeCompare(t[1])),
          l =
            '<option value="">---</option><option value="us">United States</option>' +
            i
              .filter(([e]) => "us" !== e)
              .map(([e, t]) => `<option value="${e}">${escAttr(t)}</option>`)
              .join(""),
          c = (e, t) =>
            `<select id="${e}"><option value="">---</option>${t.map(([e, t]) => `<option value="${e}">${t}</option>`).join("")}</select>`,
          d = ["Home", "Videos", "Channels", "Groups", "Members", "Upload"]
            .map((e, t) => `<a${0 === t ? ' class="on"' : ""}>${e}</a>`)
            .join(""),
          u = [
            "My Videos",
            "My Favorites",
            "My Messages",
            "My Subscriptions",
            "My Playlists",
            "My Groups",
            "My Profile",
          ]
            .map((e) => `<a>${e}</a>`)
            .join("<i>|</i>"),
          h =
            '<div class="y6side"><h2 style="color:#03c;font-size:12px">Log In</h2><div style="margin-bottom:6px">Already a Member? Log in here.</div>\n        <div class="y6err" id="y6le"></div>\n        <table><tr><td class="y6l">User Name :</td><td><input type="text" id="y6lu" maxlength="20" autocomplete="off" spellcheck="false"></td></tr>\n        <tr><td class="y6l">Password :</td><td><input type="password" id="y6lp" maxlength="128" autocomplete="off"></td></tr>\n        <tr><td></td><td><button id="y6lb">Log In</button></td></tr>\n        <tr><td></td><td class="y6s" style="padding-top:4px"><b>Forgot:</b> <a id="y6fu">username</a> | <a id="y6fp">password</a></td></tr></table></div>',
          p =
            '<div class="y6side"><h2>What is YouTube?</h2><div>YouTube is a way to get your videos to the people who matter to you. With YouTube you can:</div>\n        <ul><li>Upload, tag and share your videos worldwide</li><li>Browse thousands of original videos uploaded by community members</li><li>Find, join and create video groups to connect with people with similar interests</li>\n        <li>Customize your experience with playlists and subscriptions</li><li>Integrate YouTube with your website using video embeds or APIs</li></ul>\n        <div>To learn more about our service, please see our <a>Help</a> section.</div></div>';
        (sList.innerHTML =
          YT06_CSS +
          `<div class="yt06"><div class="y6hd"><img class="y6logo" id="y6home" src="social/youtube/2006-logo_sm.gif" alt="YouTube"><img class="y6tag" src="social/youtube/2006-tagline-20pt.gif" alt="Broadcast Yourself">\n        <div class="y6ut"><a id="y6su">Sign Up</a> | <a id="y6li">Log In</a> | <a>Help</a></div></div>\n      <div class="y6sr"><input type="text" maxlength="128"><button>Search</button></div>\n      <div class="y6tabs">${d}</div><div class="y6sub">${u}</div>` +
          ("in" === o
            ? `<h1>Log In</h1>${h}${p}`
            : `<h1>Join YouTube</h1><div class="lightFocusBox"><div class="y6bh">Sign Up</div>\n        <div class="y6lead">Joining YouTube is free and easy. Just fill out the account information below.</div><div class="y6req">(All fields required)</div>\n        <div class="y6err" id="y6e"></div>\n        <table><tr><td class="y6l">Email Address:</td><td><select id="y6m" style="width:100%;max-width:184px">${r}</select></td></tr>\n        <tr><td class="y6l">User Name:</td><td><input type="text" id="y6u" maxlength="20" autocomplete="off" spellcheck="false"></td></tr>\n        <tr><td class="y6l">Password:</td><td><input type="password" id="y6p" maxlength="128" autocomplete="off"></td></tr>\n        <tr><td class="y6l">Confirm Password:</td><td><input type="password" id="y6p2" maxlength="128" autocomplete="off"></td></tr>\n        <tr><td class="y6l">Country:</td><td><select id="y6c" style="width:100%;max-width:184px">${l}</select></td></tr>\n        <tr><td class="y6l">Postal Code:</td><td><input type="text" id="y6z" maxlength="10" autocomplete="off" style="max-width:90px"><div class="y6s">Required for US, UK &amp; Canada Only</div></td></tr>\n        <tr><td class="y6l">Gender:</td><td class="y6g"><label><input type="radio" name="y6g" value="m">Male</label><label><input type="radio" name="y6g" value="f">Female</label></td></tr>\n        <tr><td class="y6l">Date of Birth:</td><td>${c(
                "y6bm",
                ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                  (e, t) => [t + 1, e],
                ),
              )} ${c(
                "y6bd",
                Array.from({ length: 31 }, (e, t) => [t + 1, t + 1]),
              )} ${c(
                "y6by",
                Array.from({ length: 100 }, (e, t) => [s - t, s - t]),
              )}</td></tr>\n        <tr><td></td><td style="padding-top:8px"><label class="y6ck"><input type="checkbox" checked>Sign me up for "The Weekly Tube" email</label></td></tr>\n        <tr><td></td><td class="y6s" style="padding-top:6px">- I certify I am over 13 years old.<br>- I agree to the <a>terms of use</a> and <a>privacy policy</a>.</td></tr>\n        <tr><td></td><td style="padding-top:10px"><button id="y6go">Sign Up</button></td></tr></table></div>${h}${p}`) +
          `<div class="y6ft"><a>Our Blog</a> | <a>Explore YouTube</a> | <a>About Us</a> | <a>Help</a> | <a>Safety Tips</a> | <a>Developers</a> | <a>Terms of Use</a> | <a>Privacy Policy</a> | <a>Copyright Notices</a></div>\n      <div class="y6cp">Copyright &copy; ${s} YouTube, Inc.&trade; <img src="social/youtube/2006-rss.gif" alt="RSS"></div></div>`),
          (sList.scrollTop = 0);
        const m = (e) => document.getElementById(e),
          f = (o) => {
            play("choice"), yt2006Signup(e, t, a, o);
          };
        (m("y6home").onclick = m("y6su").onclick = () => f("up")), (m("y6li").onclick = () => f("in"));
        const g = (e) => {
          const t = m("y6le");
          (t.innerHTML = e), t.classList.add("on");
        };
        if (
          (pwAutofill(m("y6lp"), [m("y6lp")], 128),
          (m("y6fu").onclick = m("y6fp").onclick =
            () => {
              play("choice"), g("We sent the details to the email address on your account.");
            }),
          (m("y6lb").onclick = () => {
            play("choice");
            const e = String(m("y6lu").value || "").trim(),
              t = m("y6lp").value;
            if (!e || !t) return g("Please enter your user name and password.");
            const a = Object.keys(state.social).find(
              (t) =>
                "youtube" === socBase(t) &&
                !state.social[t].stranger &&
                String(state.social[t].handle || "").toLowerCase() === e.toLowerCase(),
            );
            return a && pwOf(a) === t
              ? state.social[a].banned
                ? g("This account has been suspended.")
                : void openSocialAccount(a)
              : g("Invalid username or password.");
          }),
          "in" === o)
        )
          return screen.classList.add("open");
        const y = m("y6c");
        y.value = COUNTRIES[state.country] ? state.country : "";
        const b = (e) => {
          const t = m("y6e");
          (t.innerHTML = e), t.classList.add("on"), (sList.scrollTop = 0);
        };
        n.length || b("You need an email address first."),
          pwAutofill(m("y6p"), [m("y6p"), m("y6p2")], 128),
          (m("y6go").onclick = () => {
            play("choice"), m("y6e").classList.remove("on");
            const t = m("y6m").value,
              o = String(m("y6u").value || "").trim(),
              n = m("y6p").value,
              r = sList.querySelector("input[name=y6g]:checked"),
              i = +m("y6bm").value,
              l = +m("y6bd").value,
              c = +m("y6by").value;
            if (!t) return b("You need an email address first.");
            if (!o) return b("Please enter a user name.");
            if (!/^[A-Za-z0-9]+$/.test(o)) return b("User Name can only contain letters A-Z or numbers 0-9.");
            if (o.length < 3) return b("User Name must be at least 3 characters long.");
            if (isBadName(o)) return b("That user name is not allowed.");
            const d = npcOwner("youtube", o),
              u = Object.keys(state.social).some(
                (t) =>
                  "youtube" === socBase(t) &&
                  t !== e &&
                  String(state.social[t].handle || "").toLowerCase() === o.toLowerCase(),
              );
            if ((d && !d.sold) || u)
              return b(`The user name "${escAttr(o)}" is already taken. Please choose another.`);
            if (n.length < 6) return b("Your password must be at least 6 characters long.");
            if (n !== m("y6p2").value) return b("The passwords you entered do not match.");
            if (!y.value) return b("Please select a country.");
            if (["us", "gb", "ca"].includes(y.value) && !String(m("y6z").value || "").trim())
              return b("Please enter your postal code.");
            if (!r) return b("Please select your gender.");
            if (!i || !l || !c || new Date(c, i - 1, l).getMonth() !== i - 1)
              return b("Please enter a valid date of birth.");
            if (s - c < 13) return b("You must be over 13 years old to sign up for YouTube.");
            socialSignup(e, t, o);
            const h = state.social[e];
            h && ((h.pw = n), (h.pwY = socYear()), (h.handle = o)), a && a(), openSocialAccount(e);
          }),
          screen.classList.add("open");
      }
      const YT08_S = "url(social/youtube/2008-master.gif) no-repeat",
        YT08_CSS = `<style>\n    .yt08{background:#fff;color:#000;font:12px Arial,sans-serif;min-height:100%;padding:4px 8px 0;box-sizing:border-box}\n    .yt08 a{color:#03c;cursor:pointer}\n    .yt08 .y8mh{display:flex;align-items:flex-start;gap:8px}\n    .yt08 .y8logo{width:132px;height:63px;background:#fff ${YT08_S} 0 0;flex:none;cursor:pointer;margin:1px 0 6px}\n    .yt08 .y8ui{margin-left:auto;text-align:right;font-size:11px}\n    .yt08 .y8ul{display:flex;justify-content:flex-end;flex-wrap:wrap;row-gap:3px}\n    .yt08 .y8ul span{border-left:1px solid #000;padding-left:6px;margin-left:6px;line-height:12px}\n    .yt08 .y8ul span:first-child{border-left:none;padding-left:1px;margin:0}\n    .yt08 .y8ul a{text-decoration:none}\n    .yt08 .y8lg{margin-top:8px}\n    .yt08 .y8lg a{text-decoration:none;border-bottom:1px dotted #03c}\n    .yt08 .y8tabs{display:flex;gap:5px;margin:2px 0 0}\n    .yt08 .y8tab{flex:1;display:flex;min-width:0;background:${YT08_S} 0 -137px}\n    .yt08 .y8tab i{flex:none;width:5px;height:28px;background:${YT08_S} -152px 0}\n    .yt08 .y8tab i+a+i{background-position:-157px 0}\n    .yt08 .y8tab a{flex:1;min-width:0;height:22px;padding-top:6px;text-align:center;color:#039;font:700 13px Arial,sans-serif;text-decoration:none;white-space:nowrap;overflow:hidden}\n    .yt08 .y8tab.on{background-position:0 -100px}\n    .yt08 .y8tab.on i{background-position:-142px 0}\n    .yt08 .y8tab.on i+a+i{background-position:-147px 0}\n    .yt08 .y8tab.on a{color:#333}\n    .yt08 .y8bar{display:flex;height:37px;margin-top:0}\n    .yt08 .y8bar>i{flex:none;width:5px;height:37px;background:${YT08_S} -132px 0}\n    .yt08 .y8bar>i:last-child{background-position:-137px 0}\n    .yt08 .y8sb{flex:1;min-width:0;display:flex;align-items:center;gap:4px;padding:0 4px;background:url(social/youtube/2008-master.gif) repeat-x 0 -63px}\n    .yt08 .y8sb input{flex:1;min-width:0;border:1px solid #999;padding:2px 0 3px 2px;font-size:13px}\n    .yt08 .y8sb select{font-size:12px;max-width:72px}\n    .yt08 .y8sb button,.yt08 .y8sbt{font:12px Arial,sans-serif;padding:1px 5px}\n    .yt08 .y8up{display:flex;flex:none;text-decoration:none!important}\n    .yt08 .y8up i{width:5px;height:25px;background:${YT08_S} -132px -37px}\n    .yt08 .y8up i+b+i{background-position:-137px -37px}\n    .yt08 .y8up b{height:20px;padding:5px 7px 0;background:${YT08_S} 0 -174px;background-repeat:repeat-x;color:#000;font-size:12px}\n    .yt08 h1{font-size:19px;font-weight:700;margin:15px 0 3px}\n    .yt08 .y8main{border-top:1px solid #ccc;padding-top:14px}\n    .yt08 .y8t{font-weight:700;padding-bottom:4px}\n    .yt08 .y8of{border:1px solid #999;padding:5px;margin-bottom:16px}\n    .yt08 .y8if{border:1px solid #ccc;background:#eee;padding:6px 4px}\n    .yt08 table{border-collapse:separate;width:100%}\n    .yt08 td{padding:4px;vertical-align:top}\n    .yt08 td.y8l{text-align:right;white-space:nowrap;width:1%;padding-top:7px}\n    .yt08 td input[type=text],.yt08 td input[type=password]{width:100%;max-width:200px;box-sizing:border-box;font:13px Arial,sans-serif;padding:2px;border:2px inset #ddd}\n    .yt08 td select{font:12px Arial,sans-serif;max-width:100%}\n    .yt08 .y8inf{font-size:11px;margin:3px 0}\n    .yt08 .y8pw{height:2px;width:180px;max-width:100%;background:#e0e0e0;margin-top:2px}\n    .yt08 .y8pw b{display:block;height:2px;width:0}\n    .yt08 .y8ca{font-size:11px;text-decoration:none}\n    .yt08 .y8ok{font-size:11px;font-weight:700;margin-top:2px}\n    .yt08 .y8cap{display:flex;align-items:flex-end;gap:6px}\n    .yt08 .y8cap canvas{border:1px solid #ccc;background:#fff;width:150px;height:46px}\n    .yt08 .y8ck{display:flex;gap:4px;align-items:flex-start}\n    .yt08 .y8ck input{margin:1px 0 0}\n    .yt08 .y8warn{font-size:11.5px;line-height:15px;margin:8px 0 0}\n    .yt08 .errorBox{background:#ffaeae;padding:6px;margin:0 0 8px;text-align:center;font-size:13px;display:none}\n    .yt08 .errorBox.on{display:block}\n    .yt08 .y8btn{display:inline-flex;cursor:pointer;text-decoration:none!important;user-select:none}\n    .yt08 .y8btn i{width:5px;height:25px;background:${YT08_S} -162px -37px}\n    .yt08 .y8btn i+b+i{background-position:-167px -37px}\n    .yt08 .y8btn b{height:20px;padding:5px 5px 0;background:url(social/youtube/2008-master.gif) repeat-x -310px -377px;color:#03c;font-size:13px}\n    .yt08 .y8btn:active b{color:#039;padding-top:6px;height:19px}\n    .yt08 .y8txt{margin:0 4px 14px}\n    .yt08 .y8txt ul{margin:6px 0 0 18px;padding:0;line-height:16px}\n    .yt08 .y8sl{text-align:center;font-size:11px}\n    .yt08 .y8sl a{text-decoration:none}\n    .yt08 .y8ft{margin:15px -8px 0;font-size:11px;line-height:13px;background:#eee;border-top:1px solid #ccc}\n    .yt08 .y8fs{display:flex;gap:4px;padding:10px}\n    .yt08 .y8fs input{flex:1;min-width:0;font-size:12px}\n    .yt08 .y8fl{border-top:1px solid #ccc;border-bottom:1px solid #ccc;padding:12px 10px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:0 8px;background:#fff}\n    .yt08 .y8fl div+div{border-left:1px solid #ccc;padding-left:8px}\n    .yt08 .y8fl b{display:block;color:#333;margin-bottom:2px}\n    .yt08 .y8fl a{display:block;line-height:15px}\n    .yt08 .y8cp{font-size:11px;padding:15px 0;text-align:center;background:#fff}\n  </style>`;
      function yt08Captcha(e) {
        const t = Array.from({ length: 6 }, () => "abcdefghjkmnpqrstuvwxyz"[rint(0, 22)]).join(""),
          a = e.getContext("2d");
        (e.width = 300),
          (e.height = 92),
          (a.fillStyle = "#fff"),
          a.fillRect(0, 0, 300, 92),
          (a.font = 'italic 700 46px "Times New Roman",serif'),
          (a.textBaseline = "middle"),
          [...t].forEach((e, t) => {
            a.save(),
              a.translate(26 + 44 * t, 46 + rint(-8, 8)),
              a.rotate(0.6 * (Math.random() - 0.5)),
              (a.fillStyle = "#000"),
              a.fillText(e, 0, 0),
              a.restore();
          }),
          (a.strokeStyle = "#000"),
          (a.lineWidth = 1.8);
        for (let e = 0; e < 2; e++) {
          a.beginPath(), a.moveTo(0, rint(20, 72));
          for (let t = 0; t <= 300; t += 20) a.lineTo(t, 46 + 18 * Math.sin(t / 30 + 2 * e) + rint(-4, 4));
          a.stroke();
        }
        return t;
      }
      function yt2008Signup(e, t, a) {
        const o = (state.emails || []).filter((e) => !e.hacked),
          n = socYear();
        (sTitle.textContent = "YOUTUBE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial);
        const s = o
            .map((e) => `<option${e.addr === t ? " selected" : ""}>${escAttr(e.addr)}</option>`)
            .join(""),
          r = Object.entries(window.COUNTRIES || {})
            .map(([e, [t]]) => [e, t])
            .sort((e, t) => e[1].localeCompare(t[1])),
          i =
            '<option value="">---</option>' +
            r.map(([e, t]) => `<option value="${e}">${escAttr(t)}</option>`).join(""),
          l = (e, t) =>
            `<select id="${e}"><option value="0">---</option>${t.map(([e, t]) => `<option value="${e}">${t}</option>`).join("")}</select>`,
          c = (e, t) => `<a class="y8btn" id="${e}"><i></i><b>${t}</b><i></i></a>`,
          d = ["Home", "Videos", "Channels", "Community"]
            .map((e, t) => `<div class="y8tab${t ? "" : " on"}"><i></i><a>${e}</a><i></i></div>`)
            .join(""),
          u = (e, t) => `<div><b>${e}</b>${t.map((e) => `<a>${e}</a>`).join("")}</div>`;
        (sList.innerHTML =
          YT08_CSS +
          `<div class="yt08"><div class="y8mh"><div class="y8logo" id="y8home"></div>\n        <div class="y8ui"><div class="y8ul"><span><b><a id="y8su">Sign Up</a></b></span><span><a>QuickList</a> (0)</span><span><a>Help</a></span><span><a id="y8si">Sign In</a></span></div>\n        <div class="y8lg"><a>Worldwide</a> &nbsp;|&nbsp; <a>English</a></div></div></div>\n      <div class="y8tabs">${d}</div>\n      <div class="y8bar"><i></i><div class="y8sb"><input type="text" maxlength="128"><select><option>Videos</option><option>Channels</option></select><button class="y8sbt">Search</button>\n        <a class="y8up"><i></i><b>Upload</b><i></i></a></div><i></i></div>\n      <h1>Create your YouTube Account</h1>\n      <div class="y8main">\n        <div class="y8t">Create Your YouTube Account</div>\n        <div class="y8of"><div class="y8if"><div class="errorBox" id="y8e"></div><table>\n          <tr><td class="y8l">Email Address:</td><td><select id="y8m" style="width:100%;max-width:200px">${s}</select></td></tr>\n          <tr><td class="y8l">Password:</td><td><input type="password" id="y8p" maxlength="20" autocomplete="off"><div class="y8inf" style="color:#03c">Password strength: <span id="y8ps"></span></div><div class="y8pw"><b id="y8pb"></b></div></td></tr>\n          <tr><td class="y8l">Re-type Password:</td><td><input type="password" id="y8p2" maxlength="20" autocomplete="off"></td></tr>\n          <tr><td class="y8l" style="padding-top:18px">Username:</td><td style="padding-top:14px"><input type="text" id="y8u" maxlength="20" autocomplete="off" spellcheck="false"><div id="y8uc"></div>\n            <div class="y8inf">Your username can only contain letters A-Z or numbers 0-9</div><a class="y8ca" id="y8chk">Check Availability</a></td></tr>\n          <tr><td class="y8l" style="padding-top:18px">Location:</td><td style="padding-top:14px"><select id="y8c" style="width:100%;max-width:200px">${i}</select></td></tr>\n          <tr id="y8zr"><td class="y8l">Postal Code:</td><td><input type="text" id="y8z" maxlength="11" autocomplete="off" style="max-width:100px"></td></tr>\n          <tr><td class="y8l">Date of Birth:</td><td>${l(
            "y8bm",
            [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((e, t) => [t + 1, e]),
          )} ${l(
            "y8bd",
            Array.from({ length: 31 }, (e, t) => [t + 1, t + 1]),
          )} ${l(
            "y8by",
            Array.from({ length: 100 }, (e, t) => [n - t, n - t]),
          )}</td></tr>\n          <tr><td class="y8l">Gender:</td><td style="padding-top:6px"><label><input type="radio" name="y8g" value="m">Male</label> &nbsp; <label><input type="radio" name="y8g" value="f">Female</label></td></tr>\n          <tr><td></td><td style="padding-top:12px"><div class="y8cap"><canvas id="y8cv"></canvas><a class="y8inf" id="y8new">New image</a></div></td></tr>\n          <tr><td class="y8l">Word Verification:</td><td><input type="text" id="y8w" maxlength="10" autocomplete="off" spellcheck="false"><div class="y8inf">Enter the text in the image</div></td></tr>\n          <tr><td></td><td><label class="y8ck"><input type="checkbox" checked><span>&nbsp;Let others find my channel on YouTube if they have my email address</span></label></td></tr>\n          <tr><td class="y8l">Terms of Use,<br>Privacy Policy:</td><td><label class="y8ck"><input type="checkbox" id="y8t"><span style="padding-top:2px">I agree to the <a>Terms of Use</a> and <a>Privacy Policy</a>.</span></label>\n            <p class="y8warn">Uploading materials that you do not own is a copyright violation and against the law. If you upload material you do not own, your account will be deleted.</p></td></tr>\n          <tr><td></td><td style="padding:8px 4px 10px">${c("y8go", "Create my account")}</td></tr></table></div></div>\n        <div class="y8txt"><div class="y8t">Join the largest worldwide video-sharing community!</div><div>Sign up now to get full access with your YouTube account:</div>\n          <ul><li>Comment, rate, and make video responses to your favorite videos</li><li>Upload and share your videos with millions of other users</li><li>Save your favorite videos to watch and share later</li><li>Enter your videos into contests for fame and prizes</li></ul></div>\n        <p style="margin:0 0 6px"><strong>Already have an account?</strong></p>\n        <div class="y8of" id="y8lf"><div class="y8if"><div style="text-align:center;padding:4px 0"><img src="social/youtube/2008-logo-grey.png" alt="" style="width:73px;height:29px"></div><div class="errorBox" id="y8le"></div><table>\n          <tr><td class="y8l">Username:</td><td><input type="text" id="y8lu" maxlength="20" autocomplete="off" spellcheck="false"></td></tr>\n          <tr><td class="y8l">Password:</td><td><input type="password" id="y8lp" maxlength="128" autocomplete="off"></td></tr>\n          <tr><td></td><td>${c("y8lb", "Sign In")}</td></tr>\n          <tr><td colspan="2"><div class="y8sl"><a id="y8fu">Forgot Username</a>&nbsp;|&nbsp;<a id="y8fp">Forgot Password</a>&nbsp;|&nbsp;<a>Help</a></div></td></tr></table></div></div>\n        <div class="y8of"><div class="y8if" style="background:#fff;text-align:center;padding:8px 4px"><img src="social/youtube/2008-google.png" alt="Google" style="width:80px;height:31px">\n          <div class="y8sl" style="margin-top:4px;font-size:12px"><a id="y8gg"><strong>Sign in with your Google Account</strong>!</a></div></div></div></div>\n      <div class="y8ft"><div class="y8fs"><input type="text" maxlength="128"><select><option>Videos</option><option>Channels</option></select><button>Search</button></div>\n        <div class="y8fl">${u("Your Account", ["Videos", "Favorites", "Playlists", "Inbox", "Subscriptions", "more..."])}${u("Help &amp; Info", ["Help Resources", "Safety Tips", "Developer APIs", "Advertising", "Copyright Notices", "Community Guidelines"])}${u("YouTube", ["Company Info", "TestTube", "Terms of Use", "Privacy Policy", "Press", "Contact", "Blog", "Jobs"])}</div>\n        <div class="y8cp">&copy; ${n} YouTube, LLC</div></div></div>`),
          (sList.scrollTop = 0);
        const h = (e) => document.getElementById(e);
        let p = yt08Captcha(h("y8cv"));
        (h("y8new").onclick = () => {
          play("choice"), (p = yt08Captcha(h("y8cv")));
        }),
          (h("y8home").onclick = h("y8su").onclick =
            () => {
              play("choice"), yt2008Signup(e, t, a);
            }),
          (h("y8si").onclick = () => {
            play("choice"), h("y8lf").scrollIntoView({ block: "center" }), h("y8lu").focus();
          });
        const m = h("y8c"),
          f = h("y8zr"),
          g = () => {
            f.style.display = ["us", "gb", "ca"].includes(m.value) ? "" : "none";
          };
        (m.value = COUNTRIES[state.country] ? state.country : ""), g(), (m.onchange = g);
        const y = h("y8p"),
          b = [
            ["", 0, ""],
            ["Weak", 25, "red"],
            ["Fair", 50, "yellow"],
            ["Good", 75, "#6699CC"],
            ["Strong", 100, "green"],
          ];
        (y.oninput = () => {
          const [e, t, a] =
            b[
              (() => {
                const e = y.value;
                if (!e) return 0;
                let t = e.length >= 6 ? 1 : 0;
                return (
                  e.length >= 8 && t++,
                  /[0-9]/.test(e) && /[a-z]/i.test(e) && t++,
                  (/[^a-z0-9]/i.test(e) || (/[a-z]/.test(e) && /[A-Z]/.test(e))) && t++,
                  Math.max(1, Math.min(4, t))
                );
              })()
            ];
          (h("y8ps").textContent = e), Object.assign(h("y8pb").style, { width: `${t}%`, background: a });
        }),
          pwAutofill(y, [y, h("y8p2")], 20),
          pwAutofill(h("y8lp"), [h("y8lp")], 128);
        const v = (t) => {
            const a = npcOwner("youtube", t);
            return (
              (a && !a.sold) ||
              Object.keys(state.social).some(
                (a) =>
                  "youtube" === socBase(a) &&
                  a !== e &&
                  String(state.social[a].handle || "").toLowerCase() === t.toLowerCase(),
              )
            );
          },
          w = (e, t) => {
            h("y8uc").innerHTML = `<div class="y8ok" style="color:${e ? "#090" : "#c00"}">${t}</div>`;
          };
        (h("y8u").oninput = () => {
          h("y8uc").innerHTML = "";
        }),
          (h("y8chk").onclick = () => {
            play("choice");
            const e = String(h("y8u").value || "").trim();
            if (!e || !/^[A-Za-z0-9]+$/.test(e))
              return w(!1, "Your username can only contain letters A-Z or numbers 0-9");
            v(e) ? w(!1, `The username ${escAttr(e)} is not available.`) : w(!0, "Username available!");
          });
        const k = (e) => {
            const t = h("y8e");
            (t.innerHTML = e), t.classList.add("on"), (sList.scrollTop = 0);
          },
          $ = (e) => {
            const t = h("y8le");
            (t.innerHTML = e), t.classList.add("on");
          };
        o.length || k("You need an email address first."),
          (h("y8fu").onclick = h("y8fp").onclick =
            () => {
              play("choice"), $("We sent the details to the email address on your account.");
            }),
          (h("y8gg").onclick = () => {
            play("choice"), $("You can link a Google Account after you sign in.");
          }),
          (h("y8lb").onclick = () => {
            play("choice"), h("y8le").classList.remove("on");
            const e = String(h("y8lu").value || "").trim(),
              t = h("y8lp").value;
            if (!e || !t) return $("Please enter your username and password.");
            const a = Object.keys(state.social).find(
              (t) =>
                "youtube" === socBase(t) &&
                !state.social[t].stranger &&
                String(state.social[t].handle || "").toLowerCase() === e.toLowerCase(),
            );
            return a && pwOf(a) === t
              ? state.social[a].banned
                ? $("This account has been suspended.")
                : void openSocialAccount(a)
              : $("Invalid username or password.");
          }),
          (h("y8go").onclick = () => {
            play("choice"), h("y8e").classList.remove("on");
            const t = h("y8m").value,
              o = String(h("y8u").value || "").trim(),
              s = y.value,
              r = sList.querySelector("input[name=y8g]:checked"),
              i = +h("y8bm").value,
              l = +h("y8bd").value,
              c = +h("y8by").value,
              d = () => {
                (p = yt08Captcha(h("y8cv"))), (h("y8w").value = "");
              };
            if (!t) return k("You need an email address first.");
            if (s.length < 6) return k("Your password must be at least 6 characters long.");
            if (s !== h("y8p2").value) return k("The passwords you entered do not match.");
            if (!o) return k("Please enter a username.");
            if (!/^[A-Za-z0-9]+$/.test(o))
              return k("Your username can only contain letters A-Z or numbers 0-9.");
            if (o.length < 3) return k("Your username must be at least 3 characters long.");
            if (isBadName(o)) return k("That username is not allowed.");
            if (v(o))
              return (
                w(!1, `The username ${escAttr(o)} is not available.`),
                k(`The username ${escAttr(o)} is not available.`)
              );
            if (!m.value) return k("Please select your location.");
            if ("none" !== f.style.display && !String(h("y8z").value || "").trim())
              return k("Please enter a valid postal code.");
            if (!i || !l || !c || new Date(c, i - 1, l).getMonth() !== i - 1)
              return k("Please enter a valid date of birth.");
            if (!r) return k("Please select your gender.");
            if (
              String(h("y8w").value || "")
                .trim()
                .toLowerCase() !== p
            )
              return (
                d(), k("The characters you entered didn't match the word verification. Please try again.")
              );
            if (!h("y8t").checked)
              return k(
                "Sorry, you need to agree to the Terms of Use and Privacy Policy to create an account",
              );
            if (n - c < 13) return d(), k("Sorry, you are not eligible to register for YouTube.");
            socialSignup(e, t, o);
            const u = state.social[e];
            u && ((u.pw = s), (u.pwY = socYear()), (u.handle = o)), a && a(), openSocialAccount(e);
          }),
          screen.classList.add("open");
      }
      const YT17_S = "url(social/youtube/2017-sprite.png) no-repeat",
        YT17_VIDS = [
          [
            "Trevor Noah Compares South Africa's Leaders To America's",
            "The Late Show with Stephen Colbert",
            "639,787 views",
            "16 hours ago",
            "10:43",
          ],
          ["This Beach Hut has a HIDDEN SECRET", "colinfurze", "855,498 views", "9 hours ago", "3:41"],
          [
            "Christian Guardino: Humble 16-Year-Old Is Awarded the Golden Buzzer - America's Got Talent 2017",
            "America's Got Talent",
            "4,287,859 views",
            "1 day ago",
            "4:40",
          ],
          ["NICEST Car Horn Ever- DIY", "Mark Rober", "2,335,118 views", "1 day ago", "5:51"],
          [
            "Daddy's Home 2 - Official Trailer - Paramount Pictures",
            "Paramount Pictures",
            "115,051 views",
            "8 hours ago",
            "2:07",
          ],
          [
            "Miley Cyrus Busks in NYC Subway in Disguise",
            "The Tonight Show Starring Jimmy Fallon",
            "1,339,120 views",
            "20 hours ago",
            "3:44",
          ],
          [
            "KYLIE COSMETICS: THE VACATION COLLECTION | Review & Swatches",
            "jeffreestar",
            "960,322 views",
            "7 hours ago",
            "18:30",
          ],
          [
            "Dodgeball is Back and Ben Stiller Wants YOU to Join Him // Omaze",
            "Omaze",
            "1,373,179 views",
            "1 day ago",
            "4:14",
          ],
        ],
        YT17_CSS = `<style>\n    .yt17{background:#f1f1f1;color:#000;font:13px Roboto,Arial,sans-serif;min-height:100%}\n    .yt17 .q7mh{background:#fff;border-bottom:1px solid #e8e8e8;display:flex;align-items:center;gap:10px;padding:7px 10px 8px;height:34px}\n    .yt17 .q7gd{flex:none;width:16px;height:16px;background:${YT17_S} -322px -168px;opacity:.6}\n    .yt17 .q7logo{flex:none;width:73px;height:30px;background:${YT17_S} -178px -227px;cursor:pointer}\n    .yt17 .q7sr{flex:1;min-width:0;display:flex;height:29px}\n    .yt17 .q7sr input{flex:1;min-width:0;border:1px solid #ccc;border-right:none;box-shadow:inset 0 1px 2px #eee;font:16px Roboto,Arial,sans-serif;padding:2px 6px;outline:none}\n    .yt17 .q7sr input:focus{border-color:#1c62b9}\n    .yt17 .q7sb{flex:none;width:40px;border:1px solid #d3d3d3;border-radius:0 2px 2px 0;background:#f8f8f8;display:grid;place-items:center;cursor:pointer}\n    .yt17 .q7sb i{width:15px;height:15px;background:${YT17_S} -694px -43px;opacity:.6}\n    .yt17 .q7si{flex:none;background:#167ac6;border:1px solid #167ac6;color:#fff;border-radius:2px;font:500 11px Roboto,Arial,sans-serif;height:28px;padding:0 10px;cursor:pointer;box-shadow:0 1px 0 rgba(0,0,0,.05)}\n    .yt17 .q7si:active{background:#126db3}\n    .yt17 .q7ab{background:#fff;border-bottom:1px solid #e8e8e8;display:flex;justify-content:center;gap:24px;height:40px;box-shadow:0 1px 2px rgba(0,0,0,.1)}\n    .yt17 .q7ab a{font-size:13px;line-height:40px;color:#666;cursor:pointer;border-bottom:3px solid transparent;box-sizing:border-box}\n    .yt17 .q7ab a.on{color:#333;border-bottom-color:#e62117;font-weight:500}\n    .yt17 .q7pr{background:#fff;margin:10px 0 0;padding:15px 18px;box-shadow:0 1px 2px rgba(0,0,0,.1);display:flex;align-items:center;gap:12px}\n    .yt17 .q7pr p{margin:0;flex:1;color:#767676;font-size:13px;line-height:17px}\n    .yt17 .q7sh{background:#fff;margin:10px 0 0;padding:15px 18px 6px;box-shadow:0 1px 2px rgba(0,0,0,.1)}\n    .yt17 h2{font:500 15px/19.5px Roboto,Arial,sans-serif;color:#333;margin:0 0 10px}\n    .yt17 .q7gr{display:grid;grid-template-columns:1fr 1fr;gap:14px 10px}\n    .yt17 .q7v .q7th{position:relative;padding-bottom:56.25%;background:#000 center/cover no-repeat}\n    .yt17 .q7v .q7du{position:absolute;right:2px;bottom:2px;background:rgba(0,0,0,.8);color:#fff;font:500 11px Roboto,Arial,sans-serif;padding:0 4px;height:14px;line-height:14px;opacity:.75}\n    .yt17 .q7v b{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font:500 13px/16.9px Roboto,Arial,sans-serif;color:#167ac6;margin:6px 0 2px;cursor:pointer}\n    .yt17 .q7v span{display:block;font-size:11px;line-height:14.3px;color:#767676}\n    .yt17 .q7ft{padding:20px 14px 30px;text-align:center;font-size:11px;color:#767676}\n    .yt17 .q7ft a{margin:0 6px;color:#333;cursor:pointer}\n    .gg17{background:#fff;color:#404040;font:14px Arial,sans-serif;min-height:100%;padding:0 0 30px;text-align:center}\n    .gg17 .g7logo{display:block;width:112px;height:36px;margin:0 auto;padding:20px 0 15px;cursor:pointer}\n    .gg17 h1{font:300 22px 'Open Sans',Arial,sans-serif;color:#555;margin:0 0 6px}\n    .gg17 h2{font:400 16px Arial,sans-serif;color:#555;margin:0 0 15px}\n    .gg17 .g7card{background:#f7f7f7;padding:20px 25px 20px;margin:0 auto 20px;width:304px;max-width:calc(100% - 32px);box-sizing:border-box;border-radius:2px;box-shadow:0 2px 2px rgba(0,0,0,.3);text-align:left}\n    .gg17 .g7av{display:block;width:72px;height:72px;margin:0 auto 10px;border-radius:50%}\n    .gg17 .g7nm{text-align:center;font-weight:700;font-size:16px;color:#404040;margin:0}\n    .gg17 .g7em{text-align:center;font-size:14px;color:#666;margin:2px 0 4px;word-break:break-all}\n    .gg17 .g7card input[type=email],.gg17 .g7card input[type=text],.gg17 .g7card input[type=password]{display:block;width:100%;height:44px;box-sizing:border-box;margin:16px 0 0;padding:0 8px;font:16px Arial,sans-serif;color:#404040;\n      background:#fff;border:1px solid #d9d9d9;border-top-color:#c0c0c0;border-radius:1px;outline:none}\n    .gg17 .g7card input:hover{border-color:#b9b9b9 #a0a0a0 #b9b9b9 #b9b9b9}\n    .gg17 .g7card input:focus{border-color:#4d90fe;box-shadow:inset 0 1px 2px rgba(0,0,0,.3)}\n    .gg17 .g7card input.g7bad{border-color:#dd4b39}\n    .gg17 .g7err{color:#dd4b39;font-size:13px;line-height:17px;margin:6px 0 0;min-height:0}\n    .gg17 .g7btn{display:block;width:100%;height:36px;margin:16px 0 10px;border:1px solid #3079ed;border-radius:3px;background:linear-gradient(#4d90fe,#4787ed);color:#fff;font:700 13px Arial,sans-serif;cursor:pointer;text-shadow:0 1px rgba(0,0,0,.1)}\n    .gg17 .g7btn:hover{border-color:#2f5bb7;background:linear-gradient(#4d90fe,#357ae8);box-shadow:0 1px 1px rgba(0,0,0,.1)}\n    .gg17 .g7btn:active{box-shadow:inset 0 1px 2px rgba(0,0,0,.3)}\n    .gg17 .g7row{display:flex;justify-content:space-between;align-items:center;font-size:13px;color:#666}\n    .gg17 a{color:#427fed;cursor:pointer;text-decoration:none}\n    .gg17 a:hover{text-decoration:underline}\n    .gg17 .g7ca{font-size:14px;margin:0 0 30px}\n    .gg17 .g7tag{font-size:14px;color:#555;margin:0 0 10px}\n    .gg17 .g7strip{width:230px;height:17px;margin:0 auto;background:url(social/youtube/2017-logostrip.png) 0 0/230px 17px no-repeat}\n    .gg17 .g7ft{margin-top:34px;font-size:13px;color:#737373}\n    .gg17 .g7ft a{color:#737373;margin:0 8px}\n    .gs17{background:#fff;color:#333;font:13px Arial,sans-serif;min-height:100%;text-align:left}\n    .gs17 .s7hd{display:flex;align-items:center;justify-content:space-between;background:#f1f1f1;border-bottom:1px solid #e5e5e5;padding:9px 16px;height:36px}\n    .gs17 .s7hd img{width:112px;height:36px;cursor:pointer}\n    .gs17 .s7si{background:linear-gradient(#4d90fe,#4787ed);border:1px solid #3079ed;border-radius:2px;color:#fff;font:700 11px Arial,sans-serif;height:29px;padding:0 12px;cursor:pointer}\n    .gs17 .s7mn{padding:18px 16px 40px;max-width:420px;margin:0 auto}\n    .gs17 h1{font:400 18px/24px Arial,sans-serif;color:#555;margin:0 0 16px}\n    .gs17 .s7f{margin:0 0 16px}\n    .gs17 .s7f>strong,.gs17 .s7f>label>strong{display:block;font:700 13px Arial,sans-serif;color:#222;margin:0 0 6px}\n    .gs17 .s7two{display:flex;gap:10px}\n    .gs17 .s7two>*{flex:1;min-width:0}\n    .gs17 input[type=text],.gs17 input[type=password],.gs17 input[type=tel]{display:block;width:100%;height:37px;box-sizing:border-box;padding:0 8px;font:15px Arial,sans-serif;color:#000;background:#fff;\n      border:1px solid #d9d9d9;border-top-color:#c0c0c0;border-radius:1px;outline:none}\n    .gs17 input:hover{border-color:#b9b9b9 #a0a0a0 #b9b9b9 #b9b9b9;box-shadow:inset 0 1px 2px rgba(0,0,0,.1)}\n    .gs17 input:focus{border-color:#4d90fe;box-shadow:inset 0 1px 2px rgba(0,0,0,.3)}\n    .gs17 .s7bad input,.gs17 .s7bad select,.gs17 input.s7bad{border-color:#dd4b39!important}\n    .gs17 .s7gm{position:relative}\n    .gs17 .s7gm input{padding-right:84px}\n    .gs17 .s7gm span{position:absolute;right:8px;top:12px;font-size:13px;color:#999;pointer-events:none}\n    .gs17 select{display:block;width:100%;height:37px;box-sizing:border-box;border:1px solid #dcdcdc;border-radius:2px;padding:0 24px 0 8px;font:700 11px Arial,sans-serif;color:#444;\n      -webkit-appearance:none;appearance:none;background:url(social/youtube/2017-select-arrow.png) right 10px center no-repeat,linear-gradient(#f5f5f5,#f1f1f1);cursor:pointer;outline:none}\n    .gs17 select:hover{border-color:#c6c6c6;box-shadow:0 1px 1px rgba(0,0,0,.1)}\n    .gs17 select:focus{border-color:#4d90fe}\n    .gs17 .s7bday{display:flex;gap:10px}\n    .gs17 .s7bday select{flex:1.4}\n    .gs17 .s7bday input{flex:1}\n    .gs17 .s7link{display:inline-block;margin-top:8px;color:#15c;cursor:pointer;font-size:13px}\n    .gs17 .s7err{color:#dd4b39;font-size:13px;line-height:17px;margin:6px 0 0}\n    .gs17 .s7err:empty{display:none}\n    .gs17 .s7tos{display:flex;gap:8px;align-items:flex-start;line-height:17px;margin:4px 0 0}\n    .gs17 .s7tos input{margin:1px 0 0;flex:none;width:15px;height:15px}\n    .gs17 .s7tos a{color:#15c}\n    .gs17 .s7go{display:block;width:100%;height:37px;margin:20px 0 0;border:1px solid #3079ed;border-radius:2px;background:linear-gradient(#4d90fe,#4787ed);color:#fff;font:700 11px Arial,sans-serif;cursor:pointer}\n    .gs17 .s7go:hover{border-color:#2f5bb7;background:linear-gradient(#4d90fe,#357ae8)}\n    .gs17 .s7lm{margin-top:14px;color:#999;font-size:13px;line-height:17px}\n    .gs17 .s7lm a{color:#15c}\n    .gs17 .s7sd{text-align:center;border-top:1px solid #e5e5e5;margin-top:28px;padding-top:24px}\n    .gs17 .s7sd h2{font:300 20px/24px 'Open Sans',Arial,sans-serif;color:#737373;margin:0 0 15px}\n    .gs17 .s7sd p{color:#999;font-size:13px;line-height:17px;margin:0 0 14px}\n    .gs17 .s7ft{border-top:1px solid #e5e5e5;padding:16px;font-size:13px;color:#666;text-align:center}\n    .gs17 .s7ft a{color:#666;margin:0 8px}\n  </style>`;
      function yt2017Home(e, t, a) {
        (sTitle.textContent = "YOUTUBE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial),
          (sList.innerHTML =
            YT17_CSS +
            `<div class="yt17"><div class="q7mh"><i class="q7gd"></i><div class="q7logo" id="q7home"></div>\n        <div class="q7sr"><input type="text" placeholder="Search" maxlength="128"><span class="q7sb"><i></i></span></div><button class="q7si" id="q7si">SIGN IN</button></div>\n      <div class="q7ab"><a class="on">Home</a><a>Trending</a></div>\n      <div class="q7pr"><p>Sign in now to see your channels and recommendations!</p><button class="q7si" id="q7si2">SIGN IN</button></div>\n      <div class="q7sh"><h2>Trending</h2><div class="q7gr">${YT17_VIDS.map(([e, t, a, o, n], s) => `<div class="q7v"><div class="q7th" style="background-image:url(social/youtube/2017-t${s + 1}.jpg)"><span class="q7du">${n}</span></div>\n        <b title="${escAttr(e)}">${escAttr(e)}</b><span>${escAttr(t)}</span><span>${a} &middot; ${o}</span></div>`).join("")}</div></div>\n      <div class="q7ft"><a>About</a><a>Press</a><a>Copyright</a><a>Creators</a><a>Advertise</a><a>Developers</a><a>+YouTube</a><div style="margin-top:10px"><a>Terms</a><a>Privacy</a><a>Policy &amp; Safety</a><a>Send feedback</a></div></div></div>`),
          (sList.scrollTop = 0);
        const o = (e) => document.getElementById(e),
          n = () => {
            play("choice"), gg2017Login(e, t, a);
          };
        (o("q7si").onclick = o("q7si2").onclick = n),
          sList.querySelectorAll(".q7v b,.q7th").forEach((e) => (e.onclick = n)),
          (o("q7home").onclick = () => {
            play("choice"), (sList.scrollTop = 0);
          }),
          screen.classList.add("open");
      }
      const ytGKey = (e) =>
        Object.keys(state.social).find(
          (t) =>
            "youtube" === socBase(t) &&
            !state.social[t].stranger &&
            String(state.social[t].email || "").toLowerCase() === e,
        );
      function gg2017Login(e, t, a, o) {
        (sTitle.textContent = "YOUTUBE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => (o ? gg2017Login(e, t, a) : yt2017Home(e, t, a)));
        const n = o && ytGKey(o),
          s = n ? showHandle(n) : "",
          r = (state.emails || [])
            .filter((e) => !e.hacked)
            .map((e) => `<option value="${escAttr(e.addr)}">`)
            .join("");
        (sList.innerHTML =
          YT17_CSS +
          '<div class="gg17"><img class="g7logo" id="g7home" src="social/youtube/2017-google-logo.png" alt="Google"><h1>One account. All of Google.</h1><h2>Sign in to continue to YouTube</h2>\n      <div class="g7card"><img class="g7av" src="social/youtube/2017-avatar.png" alt="">' +
          (o
            ? `<p class="g7nm">${escAttr(s)}</p><p class="g7em">${escAttr(o)}</p>\n          <input type="password" id="g7p" placeholder="Password" maxlength="128" autocomplete="off"><div class="g7err" id="g7e"></div>\n          <button class="g7btn" id="g7go">Sign in</button><div class="g7row"><label><input type="checkbox" checked style="vertical-align:-2px"> Stay signed in</label><a id="g7fg">Forgot password?</a></div>`
            : `<input type="email" id="g7m" placeholder="Email or phone" maxlength="128" autocomplete="off" spellcheck="false" list="g7ml" value="${escAttr(t || "")}"><datalist id="g7ml">${r}</datalist><div class="g7err" id="g7e"></div>\n          <button class="g7btn" id="g7go">Next</button><div style="text-align:right"><a id="g7fg">Find my account</a></div>`) +
          `</div><div class="g7ca">${o ? '<a id="g7sw">Sign in with a different account</a>' : '<a id="g7ca">Create account</a>'}</div>\n      <div class="g7tag">One Google Account for everything Google</div><div class="g7strip"></div>\n      <div class="g7ft"><a>About Google</a><a>Privacy</a><a>Terms</a><a>Help</a></div></div>`),
          (sList.scrollTop = 0);
        const i = (e) => document.getElementById(e),
          l = i("g7e"),
          c = (e, t) => {
            e.classList.add("g7bad"), (l.textContent = t);
          };
        if (
          ((i("g7home").onclick = () => {
            play("choice"), yt2017Home(e, t, a);
          }),
          !o)
        ) {
          const o = i("g7m");
          return (
            (i("g7ca").onclick = () => {
              play("choice"), gs2017Signup(e, t, a);
            }),
            (i("g7fg").onclick = () => {
              play("choice"), c(o, "Enter the email address on your account and we'll help you get back in.");
            }),
            (i("g7go").onclick = () => {
              play("choice"), o.classList.remove("g7bad"), (l.textContent = "");
              const n = String(o.value || "")
                .trim()
                .toLowerCase();
              return n
                ? ytGKey(n)
                  ? void gg2017Login(e, t, a, n)
                  : c(o, "Sorry, Google doesn't recognize that email.")
                : c(o, "Enter your email.");
            }),
            screen.classList.add("open")
          );
        }
        const d = i("g7p");
        pwAutofill(d, [d], 128),
          (i("g7sw").onclick = () => {
            play("choice"), gg2017Login(e, t, a);
          }),
          (i("g7fg").onclick = () => {
            play("choice"), c(d, "We sent a recovery link to your phone and email.");
          }),
          (i("g7go").onclick = () => (
            play("choice"),
            d.classList.remove("g7bad"),
            (l.textContent = ""),
            d.value
              ? pwOf(n) !== d.value
                ? c(d, "The email and password you entered don't match.")
                : state.social[n].banned
                  ? c(d, "This account has been disabled.")
                  : void openSocialAccount(n)
              : c(d, "Enter your password.")
          )),
          screen.classList.add("open");
      }
      function gs2017Signup(e, t, a, o = !1) {
        const n = (state.emails || []).filter((e) => !e.hacked),
          s = socYear();
        (sTitle.textContent = "YOUTUBE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => gg2017Login(e, t, a));
        const r = n
            .map(
              (e) =>
                `<option value="${escAttr(e.addr)}"${e.addr === t ? " selected" : ""}>${escAttr(e.addr)}</option>`,
            )
            .join(""),
          i = Object.entries(window.COUNTRIES || {})
            .map(([e, [t]]) => [e, t])
            .sort((e, t) => e[1].localeCompare(t[1])),
          l = (e, t, a) =>
            `<div class="s7f" id="${e}F"><strong>${t}</strong>${a}<div class="s7err" id="${e}E"></div></div>`;
        (sList.innerHTML =
          YT17_CSS +
          '<div class="gs17"><div class="s7hd"><img id="s7home" src="social/youtube/2017-google-logo.png" alt="Google"><button class="s7si" id="s7si">Sign in</button></div>\n      <div class="s7mn"><h1>Create your Google Account</h1>' +
          l(
            "s7n",
            "Name",
            '<div class="s7two"><input type="text" id="s7fn" placeholder="First" maxlength="40" autocomplete="off"><input type="text" id="s7ln" placeholder="Last" maxlength="40" autocomplete="off"></div>',
          ) +
          (o
            ? l(
                "s7u",
                "Your current email address",
                `<select id="s7cm" style="font:13px Arial,sans-serif;color:#000">${r}</select><a class="s7link" id="s7sw">I prefer to create a new Gmail address instead</a>`,
              )
            : l(
                "s7u",
                "Choose your username",
                '<div class="s7gm"><input type="text" id="s7gu" maxlength="30" autocomplete="off" spellcheck="false"><span>@gmail.com</span></div><a class="s7link" id="s7sw">I prefer to use my current email address</a>',
              )) +
          l(
            "s7p",
            "Create a password",
            '<input type="password" id="s7p1" maxlength="100" autocomplete="off">',
          ) +
          l(
            "s7p2",
            "Confirm your password",
            '<input type="password" id="s7p2i" maxlength="100" autocomplete="off">',
          ) +
          l(
            "s7b",
            "Birthday",
            `<div class="s7bday"><select id="s7bm"><option value="">Month</option>${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((e, t) => `<option value="${t + 1}">${e}</option>`).join("")}</select>\n        <input type="text" id="s7bd" placeholder="Day" maxlength="2" inputmode="numeric"><input type="text" id="s7by" placeholder="Year" maxlength="4" inputmode="numeric"></div>`,
          ) +
          l(
            "s7g",
            "Gender",
            '<select id="s7gs"><option value="">I am...</option><option value="f">Female</option><option value="m">Male</option><option value="o">Other</option><option value="n">Rather not say</option></select>',
          ) +
          l("s7ph", "Mobile phone", '<input type="tel" id="s7pn" maxlength="20" autocomplete="off">') +
          (o
            ? ""
            : l(
                "s7re",
                "Your current email address",
                `<select id="s7rm" style="font:13px Arial,sans-serif;color:#000"><option value=""></option>${r}</select>`,
              )) +
          l(
            "s7l",
            "Location",
            `<select id="s7lc" style="font:13px Arial,sans-serif;color:#000">${i.map(([e, t]) => `<option value="${e}"${e === state.country ? " selected" : ""}>${escAttr(t)}</option>`).join("")}</select>`,
          ) +
          '<div class="s7f" id="s7tF"><label class="s7tos"><input type="checkbox" id="s7t"><span>I agree to the Google <a>Terms of Service</a> and <a>Privacy Policy</a></span></label><div class="s7err" id="s7tE"></div></div>\n      <button class="s7go" id="s7go">Next step</button><div class="s7lm"><a>Learn more</a> about why we ask for this information.</div>\n      <div class="s7sd"><h2>One account is all you need</h2><p>One free account gets you into everything Google.</p><div class="g7strip" style="width:230px;height:17px;margin:0 auto 22px;background:url(social/youtube/2017-logostrip.png) 0 0/230px 17px no-repeat"></div>\n        <h2>Take it all with you</h2><p>Switch between devices, and pick up wherever you left off.</p></div></div>\n      <div class="s7ft"><a>Google</a><a>Privacy &amp; Terms</a><a>Help</a></div></div>'),
          (sList.scrollTop = 0);
        const c = (e) => document.getElementById(e);
        let d = null;
        const u = (e, t) => (
          c(`${e}F`).classList.add("s7bad"), (c(`${e}E`).textContent = t), d || (d = c(`${e}F`)), !0
        );
        (c("s7home").onclick = () => {
          play("choice"), yt2017Home(e, t, a);
        }),
          (c("s7si").onclick = () => {
            play("choice"), gg2017Login(e, t, a);
          }),
          (c("s7sw").onclick = () => {
            play("choice"), gs2017Signup(e, t, a, !o);
          }),
          pwAutofill(c("s7p1"), [c("s7p1"), c("s7p2i")], 100),
          o && !n.length && u("s7u", "You need an email address first."),
          (c("s7go").onclick = () => {
            play("choice"),
              sList.querySelectorAll(".s7f").forEach((e) => {
                e.classList.remove("s7bad");
                const t = e.querySelector(".s7err");
                t && (t.textContent = "");
              }),
              (d = null);
            const t = String(c("s7fn").value || "").trim(),
              n = String(c("s7ln").value || "").trim(),
              r = c("s7p1").value,
              i = +c("s7bm").value,
              l = +String(c("s7bd").value).trim(),
              h = +String(c("s7by").value).trim(),
              p = c("s7gs").value,
              m = o
                ? ""
                : String(c("s7gu").value || "")
                    .trim()
                    .toLowerCase(),
              f = `${m}@gmail.com`;
            if (
              (t && n
                ? (isBadName(t) || isBadName(n)) && u("s7n", "Are you sure you entered your name correctly?")
                : u("s7n", "You can't leave this empty."),
              o
                ? c("s7cm").value || u("s7u", "You need an email address first.")
                : m
                  ? /^[a-z0-9.]+$/.test(m)
                    ? m.length < 6 || m.length > 30
                      ? u("s7u", "Please use between 6 and 30 characters.")
                      : isBadName(m)
                        ? u("s7u", "That username isn't allowed. Try another?")
                        : ((state.emails || []).some((e) => e.addr === f) ||
                            emailClaimed("gmail", m, "gmail.com")) &&
                          u("s7u", "Someone already has that username. Try another?")
                    : u("s7u", "Please use only letters (a-z), numbers, and periods.")
                  : u("s7u", "You can't leave this empty."),
              r
                ? r.length < 8 &&
                  u("s7p", "Short passwords are easy to guess. Try one with at least 8 characters.")
                : u("s7p", "You can't leave this empty."),
              r && !c("s7p2i").value
                ? u("s7p2", "You can't leave this empty.")
                : r && r !== c("s7p2i").value && u("s7p2", "These passwords don't match. Try again?"),
              i && l && h
                ? (h < 1e3 || new Date(h, i - 1, l).getMonth() !== i - 1 || h > s) &&
                  u("s7b", "Hmm, the date doesn't look right. Be sure to use a four-digit number for year.")
                : u("s7b", "You can't leave this empty."),
              p || u("s7g", "You can't leave this empty."),
              c("s7t").checked ||
                u("s7t", "In order to proceed, you must agree to the Google Terms of Service."),
              d)
            )
              return d.scrollIntoView({ block: "center" });
            if (s - h < 13)
              return (
                u("s7b", "Sorry, you don't meet the age requirements for a Google Account.") &&
                d.scrollIntoView({ block: "center" })
              );
            let g = o ? c("s7cm").value : f;
            o ||
              ((state.emails ||= []).push({ prov: "gmail", addr: f, made: s, inbox: [], pw: r, pwY: s }),
              mailTo(f, "Gmail", "Welcome to Gmail", `Your new address ${f} is ready to use.`),
              say(`I made a new email address: ${f}.`));
            const y = cleanHandle(`${t}${n}`) || "user",
              b = npcOwner("youtube", y),
              v =
                y.length >= 3 &&
                (!b || b.sold) &&
                !Object.keys(state.social).some(
                  (t) => "youtube" === socBase(t) && t !== e && state.social[t].handle === y,
                )
                  ? y
                  : `${y.slice(0, 11)}${rint(1, 9999)}`;
            socialSignup(e, g, v);
            const w = state.social[e];
            w && ((w.pw = r), (w.pwY = s), (w.handle = v)), a && a(), openSocialAccount(e);
          }),
          screen.classList.add("open");
      }
      const XB11_CSS =
          "<style>\n    .xb11{background:#f7f7f7;color:#434347;font:12px 'Segoe UI',Arial,sans-serif;min-height:100%;padding-bottom:14px}\n    .xb11 *{font-family:'Segoe UI',Arial,sans-serif}\n    .xb11 .y1tp{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:6px 8px;background:linear-gradient(#fff,#f1f1f1);border-bottom:1px solid #e3e3e3}\n    .xb11 .y1tp span{color:#848589;font-size:11px;white-space:nowrap}\n    .xb11 .y1sr{display:flex;align-items:center;gap:3px;min-width:0}\n    .xb11 .y1sr select{height:20px;font-size:10px;color:#848589;border:1px solid #ccc;background:#fff;max-width:88px}\n    .xb11 .y1sr input{height:20px;width:84px;border:1px solid #ccc;font-size:11px;padding:0 4px;box-sizing:border-box;color:#333;background:#fff;min-width:0}\n    .xb11 .y1sr i{display:block;width:26px;height:22px;background:url(social/xbox/2011-icons.png) -6px -26px no-repeat}\n    .xb11 .y1hd{display:flex;align-items:center;justify-content:space-between;padding:12px 8px 10px;background:#fff}\n    .xb11 .y1hd img{width:110px;height:auto}\n    .xb11 .y1jn{display:flex;align-items:center;gap:6px}\n    .xb11 .y1jn div{text-align:right}\n    .xb11 .y1jn b{display:flex;align-items:center;justify-content:flex-end;gap:5px;color:#848589;font-size:13px}\n    .xb11 .y1jn b i{display:inline-block;width:84px;height:14px;background:url(social/xbox/2011-xbl.png) right center/contain no-repeat}\n    .xb11 .y1jn a{color:#77bb44;font-weight:700;font-size:11px;cursor:pointer}\n    .xb11 .y1jn span{color:#bdbec1;font-size:11px;margin:0 4px}\n    .xb11 .y1jn img{width:50px;height:50px}\n    .xb11 .y1nv{display:flex;flex-wrap:wrap;background:#77bb44}\n    .xb11 .y1nv a{flex:1 1 auto;color:#fff;font:400 11px Arial,sans-serif;text-align:center;padding:5px 4px;cursor:pointer;white-space:nowrap}\n    .xb11 .y1nv a.y1kn{background:#5b2d8e;flex-basis:100%}\n    .xb11 .y1hero{position:relative;background:#222}\n    .xb11 .y1hero img{display:block;width:100%;height:auto}\n    .xb11 .y1hero h3{position:absolute;left:3%;top:6%;margin:0;font:300 15px/1.15 'Segoe UI Light','Segoe UI',Arial,sans-serif;max-width:40%}\n    .xb11 .y1bar{display:flex;align-items:center;justify-content:space-between;background:rgba(0,0,0,.76);padding:6px 8px}\n    .xb11 .y1bar a{color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;gap:5px;cursor:pointer}\n    .xb11 .y1bar a i{display:inline-block;width:19px;height:19px;background:url(social/xbox/2011-arrowR.png) 0 0 no-repeat;transform:scale(.8)}\n    .xb11 .y1pg{display:flex;gap:4px}\n    .xb11 .y1pg b{width:19px;height:19px;border-radius:50%;border:1px solid #fff;color:#fff;font-size:10px;display:grid;place-items:center;cursor:pointer}\n    .xb11 .y1pg b.y1on{background:#fff;color:#000}\n    .xb11 .y1ts{display:grid;grid-template-columns:1fr 1fr;gap:10px 8px;padding:12px 8px 4px}\n    .xb11 .y1t img{display:block;width:100%;height:94px;object-fit:cover;object-position:center top}\n    .xb11 .y1t h4{font:400 15px 'Segoe UI',Arial,sans-serif;color:#434347;margin:8px 0 4px}\n    .xb11 .y1t p{font-size:10.5px;color:#434347;margin:0 0 6px;line-height:1.35}\n    .xb11 .y1t a{color:#77bb44;font:700 11px Arial,sans-serif;cursor:pointer}\n    .xb11 .y1t{border-bottom:2px solid #d4d4d4;padding-bottom:8px}\n    .xb11 .y1fl{display:flex;flex-wrap:wrap;gap:4px 0;padding:12px 8px 0;border-top:1px solid #d4d4d4;margin-top:12px}\n    .xb11 .y1fl a{color:#848589;font-size:11px;padding:0 8px;border-left:1px solid #d4d4d4;cursor:pointer}\n    .xb11 .y1fl a:first-child{border-left:0;padding-left:0}\n    .xb11 .y1lg{display:flex;justify-content:space-between;align-items:flex-end;gap:8px;padding:12px 8px 0;margin-top:12px;border-top:1px solid #e3e3e3}\n    .xb11 .y1lg .y1fl{border:0;margin:0;padding:0}\n    .xb11 .y1lg .y1fl a{font-size:10px}\n    .xb11 .y1ms{text-align:right;font-size:9px;color:#848589;white-space:nowrap}\n    .xb11 .y1ms i{display:block;width:99px;height:18px;background:url(social/xbox/2011-ms.png) no-repeat;margin-left:auto}\n    .xb11 .y1pn{background:#fff;border:1px solid #ddd;margin:12px 8px 0;box-shadow:0 1px 3px rgba(0,0,0,.08)}\n    .xb11 .y1ph{padding:12px 14px 4px;font:300 22px 'Segoe UI Light','Segoe UI',Arial,sans-serif;color:#434347}\n    .xb11 .y1pb{padding:4px 14px 16px}\n    .xb11 .y1pb label{display:block;font-size:12px;color:#434347;margin:10px 0 3px}\n    .xb11 .y1pb input,.xb11 .y1pb select{width:100%;height:26px;border:1px solid #bbb;font-size:12px;padding:0 5px;box-sizing:border-box;color:#000;background:#fff}\n    .xb11 .y1hint{color:#848589;font-size:11px;margin-top:3px}\n    .xb11 .y1btn{margin-top:12px;font:700 12px 'Segoe UI',Arial,sans-serif;padding:6px 16px;background:#77bb44;border:0;color:#fff;cursor:pointer}\n    .xb11 .y1btn.y1gry{background:#848589}\n    .xb11 .y1w{color:#d23;font-size:11px;min-height:15px;margin-top:6px}\n    .xb11 .y1ln{color:#77bb44;font-weight:700;cursor:pointer}\n  </style>",
        XB11_HERO = [
          ["h1", "Introducing<br>Call of Duty ELITE<br>Watch the debut<br>trailer now", "#434347"],
          ["h2", "Watch the new<br>Campaign Trailer!", "#fff"],
          ["h3", "The countdown to the<br>future of entertainment<br>starts now.", "#fff"],
          ["h4", "Must Have Games<br>for Xbox LIVE on<br>Windows Phone", "#434347"],
        ];
      function xbox2011Shell(e) {
        return (
          XB11_CSS +
          `<div class="xb11"><div class="y1tp"><span>United States &nbsp;•&nbsp; Support</span><div class="y1sr"><select><option>Search Site</option><option>Search Games + Marketplace</option><option>Search Support</option><option>Search Forums</option></select><input><i></i></div></div>\n      <div class="y1hd"><img src="social/xbox/2011-logo.png" alt="Xbox"><div class="y1jn"><div><b>Free. <i></i></b><a id="y1jo">Join Now</a><span>|</span><a id="y1si">Sign In</a></div><img src="social/xbox/2011-head.png" alt=""></div></div>\n      <div class="y1nv"><a>Xbox 360 + Accessories</a><a>Xbox LIVE</a><a>Games + Marketplace</a><a>Community</a><a>My Xbox</a><a class="y1kn">KINECT</a></div>\n      ${e}\n      <div class="y1fl"><a>Support</a><a>Press</a><a>For Developers</a><a>Games for Windows</a><a>Jobs</a><a>Feedback</a></div>\n      <div class="y1lg"><div class="y1fl"><a>Privacy Statement</a><a>Xbox.com Terms of Use</a><a>Code of Conduct</a><a>About Our Ads</a></div><div class="y1ms"><i></i>&copy; 2011 Microsoft</div></div></div>`
        );
      }
      function xbox2011Wire(e, t, a) {
        const o = (e) => document.getElementById(e);
        (o("y1si").onclick = () => {
          play("choice"), xbox2011LiveId(e, t, a, "in");
        }),
          (o("y1jo").onclick = () => {
            play("choice"), xbox2011LiveId(e, t, a, "up");
          });
      }
      function xbox2011Home(e, t, a) {
        (sTitle.textContent = "XBOX LIVE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial);
        (sList.innerHTML = xbox2011Shell(
          `<div class="y1hero"><img id="y1img" src="social/xbox/2011-h1.jpg" alt=""><h3 id="y1ttl"></h3>\n        <div class="y1bar"><a>Learn more <i></i></a><div class="y1pg">${XB11_HERO.map((e, t) => `<b data-h="${t}">${t + 1}</b>`).join("")}</div></div></div>\n      <div class="y1ts">${[
            ["t1", "Xbox @ E3", "Follow all of the coverage from the biggest event in gaming!", "Learn More"],
            [
              "t2",
              "ESPN on Xbox LIVE",
              "Take your love of sports to the next level and enjoy over 3,500 live, global events.",
              "Learn more",
            ],
            [
              "t3",
              "Homefront Map Pack",
              "The Fire Sale Map Pack includes two all new multiplayer maps.",
              "Learn more",
            ],
            ["t4", "Kinect", "No gadgets, no gizmos, just you. You are the controller.", "Learn More"],
          ]
            .map(
              ([e, t, a, o]) =>
                `<div class="y1t"><img src="social/xbox/2011-${e}.jpg" alt=""><h4>${t}</h4><p>${a}</p><a>${o}</a></div>`,
            )
            .join("")}</div>`,
        )),
          (sList.scrollTop = 0);
        const o = (e) => document.getElementById(e);
        let n = 0;
        const s = (e) => {
          n = e;
          const [t, a, s] = XB11_HERO[e];
          (o("y1img").src = `social/xbox/2011-${t}.jpg`),
            (o("y1ttl").innerHTML = a),
            (o("y1ttl").style.color = s),
            sList.querySelectorAll("[data-h]").forEach((t) => t.classList.toggle("y1on", +t.dataset.h === e));
        };
        sList.querySelectorAll("[data-h]").forEach(
          (e) =>
            (e.onclick = () => {
              play("choice"), s(+e.dataset.h);
            }),
        ),
          s(0);
        const r = setInterval(() => {
          if (!document.getElementById("y1img")) return clearInterval(r);
          s((n + 1) % XB11_HERO.length);
        }, 6e3);
        xbox2011Wire(e, t, a), screen.classList.add("open");
      }
      function xbox2011LiveId(e, t, a, o) {
        const n = (state.emails || []).filter((e) => !e.hacked);
        (sTitle.textContent = "XBOX LIVE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => xbox2011Home(e, t, a));
        const s = n
          .map((e) => `<option${e.addr === t ? " selected" : ""}>${escAttr(e.addr)}</option>`)
          .join("");
        (sList.innerHTML = xbox2011Shell(
          "in" === o
            ? `<div class="y1pn"><div class="y1ph">Sign in</div><div class="y1pb">Use your Windows Live ID to sign in to Xbox.com.\n          <label>Windows Live ID</label><select id="y1e">${s}</select>\n          <label>Password</label><input type="password" id="y1p" autocomplete="off">\n          <button class="y1btn" id="y1in">Sign in</button><div class="y1w" id="y1w"></div>\n          <div style="margin-top:6px">Don't have a Windows Live ID? <a class="y1ln" id="y1up">Sign up</a></div></div></div>`
            : `<div class="y1pn"><div class="y1ph">Join Xbox LIVE. Free.</div><div class="y1pb">Create your free Xbox LIVE profile with a Windows Live ID.\n          <label>Windows Live ID (e-mail address)</label><select id="y1e">${s}</select>\n          <label>Create a password</label><input type="password" id="y1p" autocomplete="off"><div class="y1hint">6-character minimum; case sensitive</div>\n          <label>Retype password</label><input type="password" id="y1c" autocomplete="off">\n          <button class="y1btn" id="y1go">Next</button><div class="y1w" id="y1w"></div>\n          <div style="margin-top:6px">Already have a Windows Live ID? <a class="y1ln" id="y1bk">Sign in</a></div></div></div>`,
        )),
          (sList.scrollTop = 0),
          xbox2011Wire(e, t, a);
        const r = (e) => document.getElementById(e),
          i = r("y1w");
        if (
          (n.length || (i.textContent = "You need an e-mail address to get a Windows Live ID."), "in" === o)
        )
          return (
            pwAutofill(r("y1p"), [r("y1p")], 16),
            (r("y1up").onclick = () => {
              play("choice"), xbox2011LiveId(e, t, a, "up");
            }),
            (r("y1in").onclick = () => {
              play("choice"), (i.textContent = "");
              const e = r("y1e").value,
                t = r("y1p").value,
                a = Object.keys(state.social).find(
                  (t) =>
                    "xboxlive" === socBase(t) && !state.social[t].stranger && state.social[t].email === e,
                );
              a && pwOf(a) === t
                ? state.social[a].banned
                  ? (i.textContent = "This Xbox LIVE account has been suspended.")
                  : openSocialAccount(a)
                : (i.textContent = "The Windows Live ID or password you entered is incorrect.");
            }),
            screen.classList.add("open")
          );
        pwAutofill(r("y1p"), [r("y1p"), r("y1c")], 16),
          (r("y1bk").onclick = () => {
            play("choice"), xbox2011LiveId(e, t, a, "in");
          }),
          (r("y1go").onclick = () => {
            play("choice"), (i.textContent = "");
            const o = r("y1e").value,
              n = r("y1p").value;
            o
              ? n.length < 6 || /\s/.test(n)
                ? (i.textContent = "Type a password that is at least 6 characters long with no spaces.")
                : n === r("y1c").value
                  ? xbox2011Gamertag(e, o, n, t, a)
                  : (i.textContent = "These passwords don't match.")
              : (i.textContent = "You need an e-mail address to get a Windows Live ID.");
          }),
          screen.classList.add("open");
      }
      function xbox2011Gamertag(e, t, a, o, n) {
        (sTitle.textContent = "XBOX LIVE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => xbox2011LiveId(e, o, n, "up"));
        const s = (cleanHandle(document.getElementById("pname").textContent.replace(/\s+/g, "")) || "Player")
          .replace(/[^A-Za-z0-9]/g, "")
          .slice(0, 15);
        (sList.innerHTML = xbox2011Shell(
          `<div class="y1pn"><div class="y1ph">Choose your gamertag</div><div class="y1pb">Your gamertag is your identity on Xbox LIVE. Friends will see it on your gamercard, in games and on the leaderboards.\n        <label>Gamertag</label><input id="y1g" maxlength="15" autocomplete="off" spellcheck="false" value="${escAttr(s)}">\n        <div class="y1hint">Up to 15 characters: letters, numbers and spaces, starting with a letter.</div>\n        <button class="y1btn y1gry" id="y1ck">Check availability</button> <button class="y1btn" id="y1ok">I accept</button>\n        <div class="y1hint" style="margin-top:8px">By clicking I accept, you agree to the Xbox LIVE Terms of Use and the Microsoft Online Privacy Statement.</div><div class="y1w" id="y1w"></div></div></div>`,
        )),
          (sList.scrollTop = 0),
          xbox2011Wire(e, o, n);
        const r = (e) => document.getElementById(e),
          i = r("y1w"),
          l = () => {
            const e = String(r("y1g").value || "")
                .trim()
                .replace(/\s+/g, " "),
              t = e.toLowerCase();
            if (!e) return "Please enter a gamertag.";
            if (!/^[A-Za-z][A-Za-z0-9 ]{0,14}$/.test(e))
              return "Gamertags can use only letters, numbers and spaces, and must start with a letter.";
            if (isBadName(e)) return "That gamertag isn't allowed. Please choose another.";
            const a = npcOwner("xboxlive", t.replace(/ /g, ""));
            return (a && !a.sold) ||
              Object.keys(state.social).some(
                (e) => "xboxlive" === socBase(e) && String(state.social[e].handle || "").toLowerCase() === t,
              )
              ? `Sorry, ${escAttr(e)} is not available.`
              : "";
          };
        (r("y1ck").onclick = () => {
          play("choice");
          const e = l();
          (i.style.color = e ? "#d23" : "#77bb44"),
            (i.innerHTML = e || `${escAttr(r("y1g").value.trim())} is available!`);
        }),
          (r("y1ok").onclick = () => {
            play("choice");
            const o = l();
            if (((i.style.color = "#d23"), (i.innerHTML = o), o)) return;
            const s = String(r("y1g").value || "")
              .trim()
              .replace(/\s+/g, " ");
            socialSignup(e, t, s);
            const c = state.social[e];
            c && ((c.pw = a), (c.pwY = socYear()), (c.handle = s)), n && n(), openSocialAccount(e);
          }),
          screen.classList.add("open");
      }
      const XB09_CSS =
        "<style>\n    .xb09{background:linear-gradient(#d6d6d6,#e4e4e4 300px,#dcdcdc);color:#333;font:12px 'Segoe UI',Tahoma,Arial,sans-serif;min-height:100%;padding-bottom:14px}\n    .xb09 *{font-family:'Segoe UI',Tahoma,Arial,sans-serif}\n    .xb09 .x9tp{background:linear-gradient(#7a7a7a,#5c5c5c);box-shadow:0 2px 3px rgba(0,0,0,.25);height:24px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;border-radius:0 0 12px 12px;margin:0 4px}\n    .xb09 .x9tp span{color:#ddd;font-size:10px;display:flex;align-items:center;gap:6px}\n    .xb09 .x9tp i{display:inline-block;width:11px;height:12px;background:url(social/xbox/2009-globe.png) no-repeat}\n    .xb09 .x9tp em{font-style:normal;color:#9c3}\n    .xb09 .x9tp a{color:#9c3;font-size:10px;cursor:pointer;margin-left:8px}\n    .xb09 .x9br{display:flex;align-items:center;justify-content:space-between;padding:10px 10px 6px;gap:8px}\n    .xb09 .x9br img.x9lg{width:96px;height:auto}\n    .xb09 .x9gc{display:flex;align-items:center;gap:6px;cursor:pointer}\n    .xb09 .x9gc b{color:#5a9d0a;font-size:11px;line-height:1.2;text-align:right}\n    .xb09 .x9gc i{display:block;width:34px;height:34px;background:url(social/xbox/2009-signout.png) 0 0 no-repeat;border:1px solid #fff}\n    .xb09 .x9sr{display:flex;align-items:center;margin:0 10px 8px;height:22px;background:#fff;border:1px solid #bbb}\n    .xb09 .x9sr input{flex:1;height:20px;border:0;font-size:11px;padding:0 6px;color:#333;background:#fff;min-width:0}\n    .xb09 .x9sr span{width:21px;height:16px;background:url(social/xbox/2009-sbtn.png) no-repeat;margin-right:2px}\n    .xb09 .x9sr span+span{background-image:url(social/xbox/2009-mybtn.png)}\n    .xb09 .x9nv{background:linear-gradient(#cfcfcf,#bdbdbd);display:flex;flex-wrap:wrap;justify-content:space-around;padding:4px 2px;box-shadow:0 3px 4px rgba(0,0,0,.12)}\n    .xb09 .x9nv a{color:#333;font-weight:700;font-size:11px;padding:2px 4px;cursor:pointer}\n    .xb09 .x9bd{background:#f4f4f4;margin:12px 8px 0;border-radius:6px;padding:8px;box-shadow:0 1px 3px rgba(0,0,0,.12)}\n    .xb09 .x9hero{display:block;width:100%;height:auto;border-radius:4px 4px 0 0}\n    .xb09 .x9sub{display:flex}\n    .xb09 .x9sub img{width:50%;height:auto;display:block}\n    .xb09 .x9sub img:last-child{border-radius:0 0 4px 0}.xb09 .x9sub img:first-child{border-radius:0 0 0 4px}\n    .xb09 .x9mo{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:12px}\n    .xb09 .x9mc{background:#fff;border:1px solid #ddd;border-radius:5px;padding:3px;box-shadow:0 1px 2px rgba(0,0,0,.08)}\n    .xb09 .x9mc img{display:block;width:100%;height:auto}\n    .xb09 .x9cs{display:block;width:120px;margin:10px auto 0}\n    .xb09 .x9fl{text-align:center;margin:14px 6px 6px;font-size:11px;line-height:1.7}\n    .xb09 .x9fl a{color:#5a9d0a;cursor:pointer}\n    .xb09 .x9fl img{vertical-align:middle}\n    .xb09 .x9lg2{display:flex;align-items:center;gap:10px;justify-content:center;border-top:1px solid #bbb;margin:6px 12px 0;padding-top:8px}\n    .xb09 .x9lg2 b{color:#888;font:italic 700 15px Arial,sans-serif}\n    .xb09 .x9lg2 div{font-size:10px;color:#666;line-height:1.6}\n    .xb09 .x9pn{background:#fff;border:1px solid #c6c6c6;border-radius:6px;margin:12px 8px 0;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.12)}\n    .xb09 .x9ph{background:linear-gradient(#7dbf2a,#5a9d0a);color:#fff;font-weight:700;font-size:14px;padding:8px 12px}\n    .xb09 .x9ph.x9wl{background:linear-gradient(#3e7cc5,#1f5aa6)}\n    .xb09 .x9pb{padding:10px 12px 14px}\n    .xb09 .x9pb label{display:block;font-weight:700;font-size:12px;margin:10px 0 3px;color:#333}\n    .xb09 .x9pb input,.xb09 .x9pb select{width:100%;height:24px;border:1px solid #abadb3;font-size:12px;padding:0 4px;box-sizing:border-box;color:#000;background:#fff}\n    .xb09 .x9hint{color:#777;font-size:11px;margin-top:3px}\n    .xb09 .x9btn{margin-top:12px;font-size:12px;padding:4px 14px;background:linear-gradient(#fdfdfd,#e2e2e2);border:1px solid #8e8f8f;border-radius:3px;color:#000;cursor:pointer}\n    .xb09 .x9btn.x9go{background:linear-gradient(#8fcc3a,#5a9d0a);border-color:#4a8a06;color:#fff;font-weight:700}\n    .xb09 .x9w{color:#c00;font-size:11px;min-height:15px;margin-top:6px}\n    .xb09 .x9ln{color:#1f5aa6;text-decoration:underline;cursor:pointer}\n  </style>";
      function xbox2009Shell(e) {
        return (
          XB09_CSS +
          `<div class="xb09"><div class="x9tp"><span>United States <i></i><em>International</em></span><span><a>Marketplace</a><a>Forums</a><a id="x9si">Sign in</a></span></div>\n      <div class="x9br"><img class="x9lg" src="social/xbox/2009-logo.png" alt="Xbox.com"><div class="x9gc" id="x9jn"><b>Join Xbox LIVE - Free</b><i></i></div></div>\n      <div class="x9sr"><input placeholder="Search Xbox.com"><span></span><span></span></div>\n      <div class="x9nv"><a>Xbox 360</a><a>Games</a><a>Accessories</a><a>Xbox LIVE</a><a>Support</a><a>Community</a></div>\n      ${e}\n      <div class="x9fl"><a>Microsoft Game Studios</a> | <a>Jobs</a> | <a>Forums</a> | <a>Sitemap</a> | <a>Español</a> | <a>Newsletter</a> | <a>Mobile</a> | <a>Feedback</a> | <a>Advertise</a> | <img src="social/xbox/2009-rss.jpg" alt="RSS"></div>\n      <div class="x9lg2"><b>Microsoft</b><div>&copy;2009 Microsoft Corporation. All Rights Reserved<br>Privacy Statement | Xbox.com Terms of Use | Code of Conduct</div></div></div>`
        );
      }
      function xbox2009Wire(e, t, a) {
        const o = (e) => document.getElementById(e);
        (o("x9si").onclick = () => {
          play("choice"), xbox2009LiveId(e, t, a, "in");
        }),
          (o("x9jn").onclick = () => {
            play("choice"), xbox2009LiveId(e, t, a, "up");
          });
      }
      function xbox2009Home(e, t, a) {
        (sTitle.textContent = "XBOX LIVE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial),
          (sList.innerHTML = xbox2009Shell(
            '<div class="x9bd"><img class="x9hero" src="social/xbox/2009-hero1.jpg" alt="Project Natal"><div class="x9sub"><img src="social/xbox/2009-hero2.jpg" alt="Halo 3 ODST"><img src="social/xbox/2009-hero3.jpg" alt="Forza 3"></div>\n      <div class="x9mo"><div class="x9mc"><img src="social/xbox/2009-m1.png" alt="More Games"></div><div class="x9mc"><img src="social/xbox/2009-m2.png" alt="More Entertainment"></div><div class="x9mc"><img src="social/xbox/2009-m3.png" alt="More Social"></div></div>\n      <img class="x9cs" src="social/xbox/2009-console.png" alt="Xbox 360 Consoles"></div>',
          )),
          (sList.scrollTop = 0),
          xbox2009Wire(e, t, a),
          screen.classList.add("open");
      }
      function xbox2009LiveId(e, t, a, o) {
        const n = (state.emails || []).filter((e) => !e.hacked);
        (sTitle.textContent = "XBOX LIVE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => xbox2009Home(e, t, a));
        const s = n
          .map((e) => `<option${e.addr === t ? " selected" : ""}>${escAttr(e.addr)}</option>`)
          .join("");
        (sList.innerHTML = xbox2009Shell(
          "in" === o
            ? `<div class="x9pn"><div class="x9ph x9wl">Sign in with your Windows Live ID</div><div class="x9pb">\n          <label>Windows Live ID</label><select id="x9e">${s}</select>\n          <label>Password</label><input type="password" id="x9p" autocomplete="off">\n          <button class="x9btn" id="x9in">Sign in</button><div class="x9w" id="x9w"></div>\n          <div style="margin-top:6px">Don't have a Windows Live ID? <a class="x9ln" id="x9up">Sign up</a></div></div></div>`
            : `<div class="x9pn"><div class="x9ph x9wl">Join Xbox LIVE - Free</div><div class="x9pb">\n          Sign up for a free Xbox LIVE Silver membership with your Windows Live ID.\n          <label>Windows Live ID (e-mail address)</label><select id="x9e">${s}</select>\n          <label>Create a password</label><input type="password" id="x9p" autocomplete="off"><div class="x9hint">Six-character minimum; case sensitive</div>\n          <label>Retype password</label><input type="password" id="x9c" autocomplete="off">\n          <button class="x9btn x9go" id="x9go">Continue</button><div class="x9w" id="x9w"></div>\n          <div style="margin-top:6px">Already have a Windows Live ID? <a class="x9ln" id="x9bk">Sign in</a></div></div></div>`,
        )),
          (sList.scrollTop = 0),
          xbox2009Wire(e, t, a);
        const r = (e) => document.getElementById(e),
          i = r("x9w");
        if (
          (n.length || (i.textContent = "You need an e-mail address to get a Windows Live ID."), "in" === o)
        )
          return (
            pwAutofill(r("x9p"), [r("x9p")], 16),
            (r("x9up").onclick = () => {
              play("choice"), xbox2009LiveId(e, t, a, "up");
            }),
            (r("x9in").onclick = () => {
              play("choice"), (i.textContent = "");
              const e = r("x9e").value,
                t = r("x9p").value,
                a = Object.keys(state.social).find(
                  (t) =>
                    "xboxlive" === socBase(t) && !state.social[t].stranger && state.social[t].email === e,
                );
              a && pwOf(a) === t
                ? state.social[a].banned
                  ? (i.textContent = "This Xbox LIVE account has been suspended.")
                  : openSocialAccount(a)
                : (i.textContent = "The e-mail address or password is incorrect.");
            }),
            screen.classList.add("open")
          );
        pwAutofill(r("x9p"), [r("x9p"), r("x9c")], 16),
          (r("x9bk").onclick = () => {
            play("choice"), xbox2009LiveId(e, t, a, "in");
          }),
          (r("x9go").onclick = () => {
            play("choice"), (i.textContent = "");
            const o = r("x9e").value,
              n = r("x9p").value;
            o
              ? n.length < 6 || /\s/.test(n)
                ? (i.textContent = "Type a password that is at least six characters long with no spaces.")
                : n === r("x9c").value
                  ? xbox2009Gamertag(e, o, n, t, a)
                  : (i.textContent = "The passwords don't match.")
              : (i.textContent = "You need an e-mail address to get a Windows Live ID.");
          }),
          screen.classList.add("open");
      }
      function xbox2009Gamertag(e, t, a, o, n) {
        (sTitle.textContent = "XBOX LIVE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => xbox2009LiveId(e, o, n, "up"));
        const s = (cleanHandle(document.getElementById("pname").textContent.replace(/\s+/g, "")) || "Player")
          .replace(/[^A-Za-z0-9]/g, "")
          .slice(0, 15);
        (sList.innerHTML = xbox2009Shell(
          `<div class="x9pn"><div class="x9ph">Choose your gamertag</div><div class="x9pb">\n        Your gamertag is your Xbox LIVE identity. It shows up on your gamercard and everywhere you play.\n        <label>Gamertag</label><input id="x9g" maxlength="15" autocomplete="off" spellcheck="false" value="${escAttr(s)}">\n        <div class="x9hint">Up to 15 characters: letters, numbers and spaces, starting with a letter.</div>\n        <button class="x9btn" id="x9ck">Check availability</button> <button class="x9btn x9go" id="x9ok">I accept</button>\n        <div class="x9hint" style="margin-top:8px">By clicking I accept, you agree to the Xbox LIVE Terms of Use and the Privacy Statement.</div><div class="x9w" id="x9w"></div></div></div>`,
        )),
          (sList.scrollTop = 0),
          xbox2009Wire(e, o, n);
        const r = (e) => document.getElementById(e),
          i = r("x9w"),
          l = () => {
            const e = String(r("x9g").value || "")
                .trim()
                .replace(/\s+/g, " "),
              t = e.toLowerCase();
            if (!e) return "Please enter a gamertag.";
            if (!/^[A-Za-z][A-Za-z0-9 ]{0,14}$/.test(e))
              return "Gamertags can use only letters, numbers and spaces, and must start with a letter.";
            if (isBadName(e)) return "That gamertag isn't allowed. Please choose another.";
            const a = npcOwner("xboxlive", t.replace(/ /g, ""));
            return (a && !a.sold) ||
              Object.keys(state.social).some(
                (e) => "xboxlive" === socBase(e) && String(state.social[e].handle || "").toLowerCase() === t,
              )
              ? `Sorry, ${escAttr(e)} is not available.`
              : "";
          };
        (r("x9ck").onclick = () => {
          play("choice");
          const e = l();
          (i.style.color = e ? "#c00" : "#5a9d0a"),
            (i.innerHTML = e || `${escAttr(r("x9g").value.trim())} is available!`);
        }),
          (r("x9ok").onclick = () => {
            play("choice");
            const o = l();
            if (((i.style.color = "#c00"), (i.innerHTML = o), o)) return;
            const s = String(r("x9g").value || "")
              .trim()
              .replace(/\s+/g, " ");
            socialSignup(e, t, s);
            const c = state.social[e];
            c && ((c.pw = a), (c.pwY = socYear()), (c.handle = s)), n && n(), openSocialAccount(e);
          }),
          screen.classList.add("open");
      }
      const XB03_CSS =
        '<style>\n    .xb03{background:#fff;color:#000;font:11px Verdana,Arial,Helvetica,sans-serif;min-height:100%;padding-bottom:12px}\n    .xb03 *{font-family:Verdana,Arial,Helvetica,sans-serif}\n    .xb03 .x3tp{display:flex;align-items:center;justify-content:flex-end;gap:5px;padding:6px 6px 4px;flex-wrap:wrap}\n    .xb03 .x3tp input{width:92px;height:17px;border:1px solid #7f9db9;font-size:11px;padding:0 3px;box-sizing:border-box;color:#000;background:#fff}\n    .xb03 .x3tp span{font-size:11px;color:#000;display:flex;align-items:center;gap:3px}\n    .xb03 .x3tp img{display:block}\n    .xb03 .x3tp .x3si{cursor:pointer}\n    .xb03 .x3hd{position:relative;width:100%;aspect-ratio:770/160;background:url(social/xbox/2003-header.png) center/100% 100% no-repeat}\n    .xb03 .x3dt{position:absolute;left:9%;top:47%;font-size:9px;color:#000}\n    .xb03 .x3nv{display:flex;flex-wrap:wrap;justify-content:center;background:#040404;border-radius:0 0 10px 10px;margin:-2px 6px 0;padding:3px 4px}\n    .xb03 .x3nv a{color:#fff;font-size:10px;padding:4px 6px;border-left:1px solid #555;cursor:pointer}\n    .xb03 .x3nv a:first-child{border-left:0;background:#99bb78;color:#000}\n    .xb03 .x3gl{background:#c0d5aa;margin:8px 6px 0;padding:6px}\n    .xb03 .x3g{display:flex;gap:6px;align-items:center;margin:4px 0 8px}\n    .xb03 .x3g img{width:70px;height:70px;flex:none}\n    .xb03 .x3g b{color:#4b8b17;font-style:italic}\n    .xb03 .x3rc{margin:8px 6px 0;text-align:center}\n    .xb03 .x3rc img{display:block;margin:0 auto 6px;max-width:100%}\n    .xb03 .x3lv{list-style:none;padding:0;margin:6px 0 10px;text-align:left;display:inline-block}\n    .xb03 .x3lv li{color:#3d7d14;font-style:italic;margin:5px 0;padding-left:12px;position:relative}\n    .xb03 .x3lv li::before{content:"";position:absolute;left:0;top:4px;width:5px;height:5px;background:#6aa632}\n    .xb03 .x3cap{color:#3d7d14;font-style:italic;font-size:11px}\n    .xb03 .x3ft{display:block;width:100%;height:auto;margin-top:12px}\n    .xb03 .x3fl{text-align:center;color:#555;margin:8px 4px 6px}\n    .xb03 .x3fl a{color:#555;text-decoration:none;cursor:pointer}\n    .xb03 .x3cp{text-align:center;color:#555;font-size:9px;line-height:1.5;margin:0 8px}\n    .xb03 .x3cp b{font-weight:700}\n    .xb03 .x3pp{border:1px solid #4b6fae;margin:10px 8px 0;background:#fff}\n    .xb03 .x3pph{background:#1d4fa0;color:#fff;font-weight:700;font-size:12px;padding:6px 8px}\n    .xb03 .x3ppb{padding:10px 10px 12px}\n    .xb03 .x3ppb label{display:block;font-weight:700;margin:8px 0 3px}\n    .xb03 .x3ppb input,.xb03 .x3ppb select{width:100%;height:20px;border:1px solid #7f9db9;font-size:11px;padding:0 3px;box-sizing:border-box;color:#000;background:#fff}\n    .xb03 .x3ppb .x3hint{color:#555;font-size:10px;margin-top:3px}\n    .xb03 .x3btn{margin-top:12px;font-size:11px;padding:3px 12px;background:#ece9d8;border:1px solid #707070;border-radius:3px;color:#000;cursor:pointer}\n    .xb03 .x3w{color:#c00;font-size:11px;min-height:14px;margin-top:6px}\n    .xb03 .x3ln{color:#00c;text-decoration:underline;cursor:pointer}\n    .xb03 .x3gt{border:1px solid #6aa632;margin:10px 8px 0;background:#f2f7ec}\n    .xb03 .x3gth{background:#040404;color:#9fd36d;font-weight:700;font-size:12px;padding:6px 8px}\n  </style>';
      function xbox2003Shell(e) {
        const t = socYear();
        return (
          XB03_CSS +
          `<div class="xb03"><div class="x3tp"><input placeholder="Search"><span><img src="social/xbox/2003-country.png" alt="">International</span><span><img src="social/xbox/2003-account.png" alt="">My Account</span><img class="x3si" id="x3si" src="social/xbox/2003-signin.png" alt="Sign in with your .NET Passport" title="Sign in with your .NET Passport"></div>\n      <div class="x3hd"><div class="x3dt">${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][(7 * t) % 12]} ${String(((13 * t) % 28) + 1).padStart(2, "0")} | United States</div></div>\n      <div class="x3nv"><a>Home</a><a>Product Catalog</a><a>Games</a><a>Xbox Live</a><a>News and Events</a><a>Community</a><a>Discover Xbox</a><a>Support</a></div>\n      ${e}\n      <img class="x3ft" src="social/xbox/2003-footer.jpg" alt="">\n      <div class="x3fl"><a>Microsoft Game Studios</a> | <a>Xbox Jobs</a> | <a>Xbox Gear Store</a> | <a>Xbox Forums</a></div>\n      <div class="x3cp">&copy;${Math.min(t, 2003)} Microsoft Corporation. All Rights Reserved. Xbox, Xbox Live, the Live Logo, and the Xbox logos are registered trademarks or trademarks of Microsoft Corp. <b>TRUSTe Approved Privacy Statement</b> | <b>Terms of Use</b> | <b>Code of Conduct</b></div></div>`
        );
      }
      function xbox2003Home(e, t, a) {
        (sTitle.textContent = "XBOX LIVE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial);
        (sList.innerHTML = xbox2003Shell(
          `<div class="x3gl">${[
            ["g1", "Counter-Strike™ for the Xbox:", "The popular FPS goes online and takes off the safety."],
            [
              "g2",
              "Ninja Gaiden®:",
              "Use your wits, your deadly sword, and your ninja skills to seek revenge.",
            ],
            ["g3", "Crimson Skies™: High Road to Revenge:", "Pilot warplanes and rescue dames in distress."],
            ["g4", "Need for Speed™ Underground:", "Trick-out your car and hit the streets!"],
            [
              "g5",
              "Top Spin™:",
              "Take your game from the playgrounds to the global courts of Xbox <i>Live</i>.",
            ],
          ]
            .map(
              ([e, t, a]) =>
                `<div class="x3g"><img src="social/xbox/2003-${e}.jpg" alt=""><div><b>${t}</b> ${a}</div></div>`,
            )
            .join(
              "",
            )}</div>\n      <div class="x3rc"><img src="social/xbox/2003-plat.jpg" alt="Platinum Hits"><img src="social/xbox/2003-hdrlive.png" alt="Xbox Live"><img src="social/xbox/2003-live70.jpg" alt="More than 70 Xbox Live games">\n        <ul class="x3lv"><li>Magic The Gathering</li><li>Content Download: GRIT</li><li>Play the Band: O.A.R.</li></ul>\n        <img src="social/xbox/2003-hdrwm.png" alt="Windows Media"><img src="social/xbox/2003-r6.jpg" alt=""><div class="x3cap">Tom Clancy's Rainbow Six® 3<br>Celebrity Event</div></div>`,
        )),
          (sList.scrollTop = 0),
          (document.getElementById("x3si").onclick = () => {
            play("choice"), xbox2003Passport(e, t, a);
          }),
          screen.classList.add("open");
      }
      function xbox2003Passport(e, t, a, o = "in") {
        const n = (state.emails || []).filter((e) => !e.hacked);
        (sTitle.textContent = "XBOX LIVE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => xbox2003Home(e, t, a));
        const s = n
          .map((e) => `<option${e.addr === t ? " selected" : ""}>${escAttr(e.addr)}</option>`)
          .join("");
        (sList.innerHTML = xbox2003Shell(
          "in" === o
            ? `<div class="x3pp"><div class="x3pph">.NET Passport Sign-in</div><div class="x3ppb">\n          <label>E-mail address</label><select id="x3e">${s}</select>\n          <label>Password</label><input type="password" id="x3p" autocomplete="off">\n          <button class="x3btn" id="x3in">Sign In</button><div class="x3w" id="x3w"></div>\n          <div style="margin-top:8px">Don't have a .NET Passport? <a class="x3ln" id="x3up">Sign Up</a></div></div></div>`
            : `<div class="x3pp"><div class="x3pph">Get a .NET Passport</div><div class="x3ppb">\n          <label>E-mail address</label><select id="x3e">${s}</select><div class="x3hint">This will be your .NET Passport sign-in name.</div>\n          <label>Password</label><input type="password" id="x3p" autocomplete="off"><div class="x3hint">Six-character minimum; no spaces.</div>\n          <label>Retype password</label><input type="password" id="x3c" autocomplete="off">\n          <button class="x3btn" id="x3go">Continue</button><div class="x3w" id="x3w"></div>\n          <div style="margin-top:8px">Already have a .NET Passport? <a class="x3ln" id="x3bk">Sign In</a></div></div></div>`,
        )),
          (sList.scrollTop = 0);
        const r = (e) => document.getElementById(e),
          i = r("x3w");
        (r("x3si").onclick = () => {
          play("choice"), xbox2003Passport(e, t, a, "in");
        }),
          n.length || (i.textContent = "You need an e-mail address to get a .NET Passport."),
          "in" === o
            ? (pwAutofill(r("x3p"), [r("x3p")], 16),
              (r("x3up").onclick = () => {
                play("choice"), xbox2003Passport(e, t, a, "up");
              }),
              (r("x3in").onclick = () => {
                play("choice"), (i.textContent = "");
                const e = r("x3e").value,
                  t = r("x3p").value,
                  a = Object.keys(state.social).find(
                    (t) =>
                      "xboxlive" === socBase(t) && !state.social[t].stranger && state.social[t].email === e,
                  );
                a && pwOf(a) === t
                  ? state.social[a].banned
                    ? (i.textContent = "This Xbox Live account has been suspended.")
                    : openSocialAccount(a)
                  : (i.textContent = "The e-mail address or password is incorrect. Please try again.");
              }))
            : (pwAutofill(r("x3p"), [r("x3p"), r("x3c")], 16),
              (r("x3bk").onclick = () => {
                play("choice"), xbox2003Passport(e, t, a, "in");
              }),
              (r("x3go").onclick = () => {
                play("choice"), (i.textContent = "");
                const o = r("x3e").value,
                  n = r("x3p").value;
                o
                  ? n.length < 6 || /\s/.test(n)
                    ? (i.textContent = "Your password must be at least six characters with no spaces.")
                    : n === r("x3c").value
                      ? xbox2003Gamertag(e, o, n, t, a)
                      : (i.textContent = "The passwords you typed do not match.")
                  : (i.textContent = "You need an e-mail address to get a .NET Passport.");
              })),
          screen.classList.add("open");
      }
      function xbox2003Gamertag(e, t, a, o, n) {
        (sTitle.textContent = "XBOX LIVE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => xbox2003Passport(e, o, n, "up"));
        const s = (cleanHandle(document.getElementById("pname").textContent.replace(/\s+/g, "")) || "Player")
          .replace(/[^A-Za-z0-9]/g, "")
          .slice(0, 15);
        (sList.innerHTML = xbox2003Shell(
          `<div class="x3gt"><div class="x3gth">Choose Your Gamertag</div><div class="x3ppb">\n        Your gamertag is your name on Xbox <i>Live</i>. Everyone you play with will see it, so choose carefully.\n        <label>Gamertag</label><input id="x3g" maxlength="15" autocomplete="off" spellcheck="false" value="${escAttr(s)}">\n        <div class="x3hint">Up to 15 characters. Use letters, numbers and spaces, and start with a letter.</div>\n        <button class="x3btn" id="x3ck">Check Availability</button> <button class="x3btn" id="x3ok">Create Gamertag</button><div class="x3w" id="x3w"></div></div></div>`,
        )),
          (sList.scrollTop = 0);
        const r = (e) => document.getElementById(e),
          i = r("x3w");
        r("x3si").onclick = () => {
          play("choice"), xbox2003Passport(e, o, n, "in");
        };
        const l = () => {
          const e = String(r("x3g").value || "")
              .trim()
              .replace(/\s+/g, " "),
            t = e.toLowerCase();
          if (!e) return "Please enter a gamertag.";
          if (!/^[A-Za-z][A-Za-z0-9 ]{0,14}$/.test(e))
            return "Gamertags can use only letters, numbers and spaces, and must start with a letter.";
          if (isBadName(e)) return "That gamertag is not allowed. Please choose another.";
          const a = npcOwner("xboxlive", t.replace(/ /g, ""));
          return (a && !a.sold) ||
            Object.keys(state.social).some(
              (e) => "xboxlive" === socBase(e) && String(state.social[e].handle || "").toLowerCase() === t,
            )
            ? `Sorry, ${escAttr(e)} is already taken.`
            : "";
        };
        (r("x3ck").onclick = () => {
          play("choice");
          const e = l();
          (i.style.color = e ? "#c00" : "#3d7d14"),
            (i.innerHTML = e || `${escAttr(r("x3g").value.trim())} is available!`);
        }),
          (r("x3ok").onclick = () => {
            play("choice");
            const o = l();
            if (((i.style.color = "#c00"), (i.innerHTML = o), o)) return;
            const s = String(r("x3g").value || "")
              .trim()
              .replace(/\s+/g, " ");
            socialSignup(e, t, s);
            const c = state.social[e];
            if ((c && ((c.pw = a), (c.pwY = socYear()), (c.handle = s)), n)) return n(), openSocialAccount(e);
            openSocialAccount(e);
          }),
          screen.classList.add("open");
      }
      const rbxNewKey = () => {
          if (!state.social.roblox) return "roblox";
          let e = 2;
          for (; state.social[`roblox~${e}`]; ) e++;
          return `roblox~${e}`;
        },
        rbxUI = () => socYear() < 2010;
      function rbxEraPage(e) {
        const t = socYear();
        return t < 2007
          ? (rbxHome2006(e), !0)
          : 2013 === t
            ? (rbxLogin2013(e), !0)
            : 2014 === t || 2015 === t
              ? (rbxSignup2014(e), !0)
              : 2016 === t || 2017 === t
                ? (rbxLogin2017(e), !0)
                : 2018 === t
                  ? (rbxSignup2018(e), !0)
                  : (2019 === t || 2020 === t) && (rbxSignup2020(e), !0);
      }
      const RBX20_CSS =
        "<style>\n    .rb20{background:#232527 url(social/roblox/2020-bg.jpg) center top/cover no-repeat;color:#fff;font-family:'Gotham SSm','Gotham','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;min-height:100%;position:relative}\n    .rb20 .q20top{display:flex;justify-content:flex-end;padding:12px 12px 0}\n    .rb20 .q20lgb{background:#fff;color:#393b3d;border:1px solid #fff;border-radius:6px;font:500 15px 'Gotham SSm','Helvetica Neue',Arial,sans-serif;padding:7px 22px;cursor:pointer}\n    .rb20 .q20logo{display:block;width:200px;height:40px;margin:18px auto 16px;background:url(social/roblox/2020-logo.svg) center/contain no-repeat}\n    .rb20 .q20pn{background:hsla(0,0%,100%,.8);box-shadow:0 1px 4px 0 #191919;margin:0 14px;padding:20px 16px 16px;color:#191919;max-width:400px;box-sizing:border-box}\n    .rb20 .q20pn h3{text-align:center;margin:0 0 16px;color:#191919;font-size:16px;font-weight:700;text-transform:uppercase;line-height:1.2}\n    .rb20 .q20pn label.q20l{display:block;color:#3f3f3f;font-size:14px;margin:0 0 4px}\n    .rb20 .q20bd{display:flex;border:1px solid #707070;border-radius:8px;overflow:hidden;background:transparent}\n    .rb20 .q20bd select{border:0;border-radius:0;height:40px;font:16px 'Gotham SSm','Helvetica Neue',Arial,sans-serif;color:#393b3d;background:transparent;padding:0 6px;min-width:0}\n    .rb20 .q20bd select+select{border-left:1px solid #707070}\n    .rb20 .q20bd .q20mo{width:40%}.rb20 .q20bd .q20dy{width:30%}.rb20 .q20bd .q20yr{width:30%}\n    .rb20 .q20in{display:block;width:100%;height:40px;border:1px solid #707070;border-radius:8px;background:transparent;font:16px 'Gotham SSm','Helvetica Neue',Arial,sans-serif;color:#191919;padding:0 12px;box-sizing:border-box}\n    .rb20 .q20in::placeholder{color:#a3a3a3}\n    .rb20 .q20in.q20bad,.rb20 .q20bd.q20bad,.rb20 .q20gb.q20bad{border-color:#d86868}\n    .rb20 .q20hint{font-size:11px;color:#3f3f3f;margin:3px 0 0}\n    .rb20 .q20v{color:#d86868;font-size:12px;min-height:15px;margin:2px 0 8px}\n    .rb20 .q20gb{display:flex;height:40px;border:1px solid #707070;border-radius:8px;overflow:hidden}\n    .rb20 .q20g{width:50%;display:grid;place-items:center;cursor:pointer}\n    .rb20 .q20g+.q20g{border-left:1px solid #707070}\n    .rb20 .q20g i{display:block;width:36px;height:36px;background-repeat:no-repeat;background-position:0 0;transform:scale(.75)}\n    .rb20 .q20g.q20f i{background-image:url(social/roblox/2020-female.png)}\n    .rb20 .q20g.q20m i{background-image:url(social/roblox/2020-male.png)}\n    .rb20 .q20g.q20sel i{background-position:-36px 0}\n    .rb20 .q20g.q20sel{background:rgba(0,0,0,.06)}\n    .rb20 .q20leg{font-size:12px;color:#3f3f3f;line-height:1.45;margin:10px 0 0;font-weight:300}\n    .rb20 .q20leg a{color:#00a2ff}\n    .rb20 .q20su{display:flex;width:100%;height:44px;align-items:center;justify-content:center;margin-top:12px;background:#00b06f;color:#fff;border:none;border-radius:8px;font:500 16px 'Gotham SSm','Helvetica Neue',Arial,sans-serif;cursor:pointer}\n    .rb20 .q20su:active{background:#3fc679}\n    .rb20 .q20lp{display:none}\n    .rb20 .q20lp.q20open{display:block}\n    .rb20 .q20lp .q20in{margin-bottom:10px}\n    .rb20 .q20lb{display:block;width:100%;height:40px;background:#fff;color:#393b3d;border:1px solid #b8b8b8;border-radius:8px;font:500 16px 'Gotham SSm','Helvetica Neue',Arial,sans-serif;cursor:pointer}\n    .rb20 .q20fp{display:block;text-align:center;color:#00a2ff;font-size:13px;margin:10px 0 0;cursor:pointer}\n    .rb20 .q20dv{text-align:center;padding:30px 10px 10px}\n    .rb20 .q20dv h2{font-size:15px;font-weight:700;text-transform:uppercase;margin:0 0 12px;color:#fff;letter-spacing:.3px}\n    .rb20 .q20st{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}\n    .rb20 .q20st img{height:34px;border-radius:5px}\n    .rb20 .q20st img.q20bx{border:1px solid #9f9e9e;box-sizing:border-box}\n    .rb20 .q20ft{background:#191919;margin-top:20px;padding:18px 12px 20px;text-align:center}\n    .rb20 .q20ft .q20fl{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 16px;margin-bottom:12px}\n    .rb20 .q20ft .q20fl a{color:#b8b8b8;font-size:15px;font-weight:300;cursor:pointer}\n    .rb20 .q20ft .q20fl a.q20pv{color:#00a2ff}\n    .rb20 .q20ft p{font-size:11px;color:#b8b8b8;margin:0;line-height:1.5}\n  </style>";
      function rbxSignup2020(e) {
        const t = (state.emails || []).filter((e) => !e.hacked),
          a = socYear();
        (sTitle.textContent = "ROBLOX"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial),
          (sList.innerHTML =
            RBX20_CSS +
            `<div class="rb20"><div class="q20top"><button class="q20lgb" id="q20tg">Log In</button></div>\n      <span class="q20logo" title="Roblox"></span>\n      <div class="q20pn q20lp" id="q20lp"><h3>Login to Roblox</h3>\n        <input class="q20in" id="q20lu" placeholder="Username/Email/Phone" autocomplete="off" spellcheck="false"><input class="q20in" id="q20lpw" type="password" placeholder="Password" autocomplete="off">\n        <div class="q20v" id="q20le"></div><button class="q20lb" id="q20li">Log In</button><a class="q20fp" id="q20fg">Forgot Password or Username?</a></div>\n      <div class="q20pn" id="q20sp"><h3>Sign up and start having fun!</h3>\n        <label class="q20l">Birthday</label><div class="q20bd" id="q20bdb"><select class="q20mo" id="q20m"><option value="0">Month</option>${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((e, t) => `<option value="${t + 1}">${e}</option>`).join("")}</select><select class="q20dy" id="q20d"><option value="0">Day</option>${Array.from({ length: 31 }, (e, t) => `<option>${t + 1}</option>`).join("")}</select><select class="q20yr" id="q20y"><option value="0">Year</option>${Array.from(
              { length: 100 },
              (e, t) => a - t,
            )
              .map((e) => `<option>${e}</option>`)
              .join(
                "",
              )}</select></div>\n        <div class="q20v" id="q20vb"></div>\n        <input class="q20in" id="q20n" maxlength="20" autocomplete="off" spellcheck="false" placeholder="Username"><div class="q20hint">Don't use your real name</div><div class="q20v" id="q20vn"></div>\n        <input class="q20in" id="q20a" type="password" maxlength="200" autocomplete="off" placeholder="Password"><div class="q20v" id="q20va"></div>\n        <label class="q20l">Gender</label><div class="q20gb" id="q20gb"><div class="q20g q20f" id="q20gf"><i></i></div><div class="q20g q20m" id="q20gm"><i></i></div></div>\n        <div class="q20leg">By clicking Sign Up, you are agreeing to the <a>Terms of Use</a> including the arbitration clause and you are acknowledging the <a>Privacy Policy</a></div>\n        <button class="q20su" id="q20go">Sign Up</button></div>\n      <div class="q20dv"><h2>Roblox on your device</h2><div class="q20st"><img src="social/roblox/2020-apple.svg" alt=""><img src="social/roblox/2020-google.svg" alt=""><img src="social/roblox/2020-amazon.png" alt=""><img class="q20bx" src="social/roblox/2020-xbox.png" alt=""><img src="social/roblox/2020-microsoft.svg" alt=""></div></div>\n      <div class="q20ft"><div class="q20fl"><a>About Us</a><a>Jobs</a><a>Blog</a><a>Parents</a><a>Gift Cards</a><a>Help</a><a>Terms</a><a class="q20pv">Privacy</a></div>\n        <p>&copy;${socYear()} Roblox Corporation. Roblox, the Roblox logo and Powering Imagination are among our registered and unregistered trademarks in the U.S. and other countries.</p></div></div>`),
          (sList.scrollTop = 0);
        const o = (e) => document.getElementById(e);
        let n = 0;
        (o("q20tg").onclick = () => {
          play("choice");
          const e = !o("q20lp").classList.contains("q20open");
          o("q20lp").classList.toggle("q20open", e),
            (o("q20sp").style.display = e ? "none" : ""),
            (o("q20tg").textContent = e ? "Sign Up" : "Log In");
        }),
          pwAutofill(o("q20lpw"), [o("q20lpw")], 200),
          (o("q20fg").onclick = () => {
            play("choice"), (o("q20le").textContent = "Check your email to reset your password.");
          }),
          (o("q20li").onclick = () => {
            play("choice");
            const e = o("q20le");
            e.textContent = "";
            const t = String(o("q20lu").value || "")
                .trim()
                .toLowerCase(),
              a = o("q20lpw").value;
            if (!t || !a) return void (e.textContent = "Username and Password are required.");
            const n = Object.keys(state.social).find(
              (e) =>
                "roblox" === socBase(e) &&
                !state.social[e].stranger &&
                (String(state.social[e].handle || "").toLowerCase() === t ||
                  String(state.social[e].email || "").toLowerCase() === t),
            );
            n && pwOf(n) === a
              ? state.social[n].banned
                ? (e.textContent = "Account has been locked.")
                : openSocialAccount(n)
              : (e.textContent = "Incorrect username or password.");
          });
        const s = (e, t, a) => ((o(t).textContent = a || ""), e && o(e).classList.toggle("q20bad", !!a), !a),
          r = () =>
            s(
              "q20bdb",
              "q20vb",
              +o("q20m").value && +o("q20d").value && +o("q20y").value ? "" : "Invalid birthday.",
            ),
          i = () => {
            const e = String(o("q20n").value || ""),
              t =
                e.length < 3 || e.length > 20
                  ? "Usernames can be 3 to 20 characters long."
                  : /^[A-Za-z0-9_]+$/.test(e)
                    ? /^_|_$/.test(e)
                      ? "Username can't start or end with _."
                      : (e.match(/_/g) || []).length > 1
                        ? "Usernames can have at most one _."
                        : isBadName(e)
                          ? "Username not appropriate for Roblox."
                          : ((e) => {
                                const t = npcOwner("roblox", e);
                                return !(
                                  (t && !t.sold) ||
                                  Object.keys(state.social).some(
                                    (t) =>
                                      "roblox" === socBase(t) &&
                                      String(state.social[t].handle || "").toLowerCase() === e,
                                  )
                                );
                              })(e.toLowerCase())
                            ? ""
                            : "This username is already in use."
                    : "Only a-z, A-Z, 0-9, and _ are allowed.";
            return s("q20n", "q20vn", t);
          },
          l = () => {
            const e = o("q20a").value,
              t =
                e.length < 8
                  ? "Password must be at least 8 characters."
                  : e.toLowerCase() === String(o("q20n").value || "").toLowerCase()
                    ? "Password shouldn't match username."
                    : /^(.)\1+$|^(password|12345678|abcdefgh|qwertyui)/i.test(e)
                      ? "Please create a more complex password."
                      : "";
            return s("q20a", "q20va", t);
          };
        ["q20m", "q20d", "q20y"].forEach((e) => (o(e).onchange = r)),
          (o("q20n").onblur = i),
          (o("q20a").onblur = l),
          pwAutofill(o("q20a"), [o("q20a")], 200),
          [
            ["q20gf", 3],
            ["q20gm", 2],
          ].forEach(
            ([e, t]) =>
              (o(e).onclick = () => {
                play("choice"),
                  (n = n === t ? 0 : t),
                  o("q20gf").classList.toggle("q20sel", 3 === n),
                  o("q20gm").classList.toggle("q20sel", 2 === n);
              }),
          ),
          (o("q20go").onclick = () => {
            if ((play("choice"), ![r(), i(), l()].every(Boolean))) return;
            const a = e || (t[0] && t[0].addr),
              n = o("q20n").value.toLowerCase(),
              s = o("q20a").value,
              c = rbxNewKey();
            socialSignup(c, a, n);
            const d = state.social[c];
            d && ((d.pw = s), (d.pwY = socYear()), (d.handle = n)), openSocialAccount(c);
          }),
          screen.classList.add("open");
      }
      const RBX18_CSS =
        "<style>\n    @font-face{font-family:'SSP14';font-weight:400;src:url(social/roblox/ssp400.woff) format('woff')}\n    @font-face{font-family:'SSP14';font-weight:600;src:url(social/roblox/ssp600.woff) format('woff')}\n    @font-face{font-family:'SSP14';font-weight:700;src:url(social/roblox/ssp700.woff) format('woff')}\n    .rb18{background:#fff;color:#474747;font-family:'SSP14','Source Sans Pro',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.25;min-height:100%}\n    .rb18 .q18hero{background:#3d6e8e url(social/roblox/2018-roller.jpg) center/cover no-repeat;padding-bottom:18px}\n    .rb18 .q18nav{background:rgba(0,0,0,.35);height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 10px}\n    .rb18 .q18nav img{width:36px;height:36px}\n    .rb18 .q18tg{border:1px solid #fff;border-radius:3px;color:#fff;background:transparent;font:400 15px 'SSP14','Source Sans Pro',sans-serif;padding:6px 12px;cursor:pointer}\n    .rb18 .q18lf{background:rgba(0,0,0,.35);padding:4px 12px 12px;display:none}\n    .rb18 .q18lf.q18open{display:block}\n    .rb18 .q18lf .q18fc{margin:8px 0 0}\n    .rb18 .q18lb{display:block;width:100%;height:34px;margin-top:8px;background:#00b259;border:1px solid transparent;color:#fff;font:400 14px 'SSP14','Source Sans Pro',sans-serif;border-radius:3px;cursor:pointer}\n    .rb18 .q18fp{display:block;text-align:center;color:#fff;font-size:13px;margin-top:8px;cursor:pointer}\n    .rb18 .q18le{color:#ffb3b3;font-size:13px;text-align:center;min-height:16px;margin-top:6px}\n    .rb18 .q18tag{display:block;width:88%;max-width:332px;height:94px;margin:22px auto 16px;background:url(social/roblox/2018-tagline.svg) center/contain no-repeat}\n    .rb18 .q18box{background:rgba(255,255,255,.95);margin:0 12px;padding:15px}\n    .rb18 .q18box h3{font-size:22px;font-weight:400;text-align:center;margin:5px 0 12px;color:#191919}\n    .rb18 .q18fc{display:block;width:100%;height:34px;padding:6px 12px;font:16px 'SSP14','Source Sans Pro',sans-serif;line-height:1.25;color:#555;background:#fff;border:1px solid #ccc;border-radius:3px;box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-sizing:border-box}\n    .rb18 .q18fc.q18bad{border-color:#d86868}\n    .rb18 .q18fc.q18good{border-color:#02b757}\n    .rb18 .q18fake{height:auto;padding:6px 10px 8px}\n    .rb18 .q18fake label{display:block;font-size:18px;font-weight:300;color:#191919;margin-bottom:4px}\n    .rb18 .q18bd{display:flex;gap:5px}\n    .rb18 .q18bd select{flex:1;height:32px;border:1px solid #ccc;border-radius:3px;background:#fff;color:#191919;font:15px 'SSP14','Source Sans Pro',sans-serif;padding:0 4px;min-width:0}\n    .rb18 .q18bd select.q18dd{flex:.7}\n    .rb18 .q18v{height:20px;color:#d86868;font-size:13px;margin:3px 0 4px}\n    .rb18 .q18gd{display:flex;align-items:center;height:46px;padding:0 10px}\n    .rb18 .q18gd label{font-size:18px;font-weight:300;color:#191919;width:75px}\n    .rb18 .q18gc{width:32px;height:32px;border-radius:16px;border:1px solid #b8b8b8;margin:0 10%;display:grid;place-items:center;cursor:pointer;box-sizing:border-box}\n    .rb18 .q18gc i{display:block;width:22px;height:26px;background-repeat:no-repeat;background-position:0 0}\n    .rb18 .q18gc.q18f i{background-image:url(social/roblox/2018-female.png)}\n    .rb18 .q18gc.q18m i{background-image:url(social/roblox/2018-male.png)}\n    .rb18 .q18gc.q18f.q18sel{border-color:#d86868}\n    .rb18 .q18gc.q18f.q18sel i{background-position:-24px 0}\n    .rb18 .q18gc.q18m.q18sel{border-color:#00a2ff}\n    .rb18 .q18gc.q18m.q18sel i{background-position:-22px 0}\n    .rb18 .q18legal{font-size:14px;color:#474747;display:flex;gap:8px;align-items:flex-start;margin:4px 0 6px;line-height:1.4}\n    .rb18 .q18legal input{width:18px;height:18px;margin:1px 0 0;flex:none}\n    .rb18 .q18legal a{color:#00a2ff}\n    .rb18 .q18su{display:block;width:100%;height:40px;margin-top:6px;background:#02b757;border:1px solid #02b757;color:#fff;font:400 18px 'SSP14','Source Sans Pro',sans-serif;border-radius:3px;cursor:pointer}\n    .rb18 .q18su:active{background:#3fc679}\n    .rb18 .q18sec{padding:24px 18px 6px;text-align:center}\n    .rb18 .q18sec h1{color:#00a2ff;font-size:30px;font-weight:400;margin:0 0 10px}\n    .rb18 .q18sec h2{color:#191919;font-size:26px;font-weight:400;margin:0 0 10px}\n    .rb18 .q18sec p{font-size:17px;font-weight:300;line-height:1.4;text-align:justify;margin:0 0 14px}\n    .rb18 .q18dev{display:block;width:84%;max-width:320px;margin:0 auto 12px}\n    .rb18 .q18st{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-bottom:6px}\n    .rb18 .q18st img{height:34px}\n    .rb18 .q18ft{border-top:1px solid #e3e3e3;margin-top:14px;padding:16px 10px 18px;text-align:center}\n    .rb18 .q18ft .q18fl{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 16px;margin-bottom:12px}\n    .rb18 .q18ft .q18fl a{color:#b8b8b8;font-size:18px;font-weight:300;cursor:pointer}\n    .rb18 .q18ft .q18fl a.q18pv{color:#00a2ff}\n    .rb18 .q18ft p{font-size:11px;color:#b8b8b8;margin:0;line-height:1.5}\n  </style>";
      function rbxSignup2018(e) {
        const t = (state.emails || []).filter((e) => !e.hacked),
          a = socYear();
        (sTitle.textContent = "ROBLOX"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial),
          (sList.innerHTML =
            RBX18_CSS +
            `<div class="rb18"><div class="q18hero">\n      <div class="q18nav"><img src="social/roblox/2018-logo.png" alt="Roblox Logo"><button class="q18tg" id="q18tg">Log In</button></div>\n      <div class="q18lf" id="q18lf"><input class="q18fc" id="q18lu" placeholder="Username" autocomplete="off" spellcheck="false"><input class="q18fc" id="q18lp" type="password" placeholder="Password" autocomplete="off">\n        <button class="q18lb" id="q18li">Log In</button><div class="q18le" id="q18le"></div><a class="q18fp" id="q18fg">Forgot Username/Password?</a></div>\n      <span class="q18tag" title="Roblox"></span>\n      <div class="q18box"><h3>Sign up and start having fun!</h3>\n        <div class="q18fc q18fake" id="q18bdb"><label>Birthday</label><div class="q18bd"><select id="q18m"><option value="0">Month</option>${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((e, t) => `<option value="${t + 1}">${e}</option>`).join("")}</select><select class="q18dd" id="q18d"><option value="0">Day</option>${Array.from({ length: 31 }, (e, t) => `<option>${t + 1}</option>`).join("")}</select><select id="q18y"><option value="0">Year</option>${Array.from(
              { length: 100 },
              (e, t) => a - t,
            )
              .map((e) => `<option>${e}</option>`)
              .join(
                "",
              )}</select></div></div>\n        <p class="q18v" id="q18vb"></p>\n        <input class="q18fc" id="q18n" maxlength="20" autocomplete="off" spellcheck="false" placeholder="Username (don't use your real name)"><p class="q18v" id="q18vn"></p>\n        <input class="q18fc" id="q18a" type="password" maxlength="200" autocomplete="off" placeholder="Password (minimum length 8)"><p class="q18v" id="q18va"></p>\n        <input class="q18fc" id="q18c" type="password" maxlength="200" autocomplete="off" placeholder="Confirm Password"><p class="q18v" id="q18vc"></p>\n        <div class="q18fc q18fake q18gd" id="q18gb"><label>Gender</label><div class="q18gc q18f" id="q18gf"><i></i></div><div class="q18gc q18m" id="q18gm"><i></i></div></div>\n        <p class="q18v" id="q18vg"></p>\n        <div class="q18legal"><input type="checkbox" id="q18tos"><label for="q18tos">By clicking <b>Sign Up</b>, you are agreeing to the <a>Terms of Use</a> and <a>Privacy Policy</a></label></div>\n        <p class="q18v" id="q18vt"></p>\n        <button class="q18su" id="q18go">Sign Up</button></div></div>\n      <div class="q18sec"><h1>WHAT IS ROBLOX?</h1><p>Roblox is the best place to Imagine with Friends. With the largest user-generated online gaming platform, and over 15 million games created by users, Roblox is the #1 gaming site for kids and teens (comScore). Every day, virtual explorers come to Roblox to create adventures, play games, role play, and learn with their friends in a family-friendly, immersive, 3D environment.</p></div>\n      <div class="q18sec"><h2>ROBLOX ON YOUR DEVICE</h2><p>You can access Roblox on PC, Mac, iOS, Android, Amazon Devices, and Xbox One. Roblox adventures are accessible from any device, so players can imagine with their friends regardless of where they are.</p>\n        <img class="q18dev" src="social/roblox/2018-devices.png" alt=""><div class="q18st">${["apple", "google", "amazon", "xbox", "windows"].map((e) => `<img src="social/roblox/2018-${e}.png" alt="">`).join("")}</div></div>\n      <div class="q18ft"><div class="q18fl"><a>About Us</a><a>Jobs</a><a>Blog</a><a>Parents</a><a>Help</a><a>Terms</a><a class="q18pv">Privacy</a></div>\n        <p>&copy;2017 Roblox Corporation. Roblox, the Roblox logo, Robux, Bloxy, and Powering Imagination are among our registered and unregistered trademarks in the U.S. and other countries.</p></div></div>`),
          (sList.scrollTop = 0);
        const o = (e) => document.getElementById(e);
        let n = 0;
        (o("q18tg").onclick = () => {
          play("choice"), o("q18lf").classList.toggle("q18open");
        }),
          pwAutofill(o("q18lp"), [o("q18lp")], 200),
          (o("q18fg").onclick = () => {
            play("choice"),
              (o("q18le").textContent = "Check your email to recover your username or password.");
          }),
          (o("q18li").onclick = () => {
            play("choice");
            const e = o("q18le");
            e.textContent = "";
            const t = String(o("q18lu").value || "")
                .trim()
                .toLowerCase(),
              a = o("q18lp").value;
            if (!t || !a) return void (e.textContent = "Username and Password are required.");
            const n = Object.keys(state.social).find(
              (e) =>
                "roblox" === socBase(e) &&
                !state.social[e].stranger &&
                String(state.social[e].handle || "").toLowerCase() === t,
            );
            n && pwOf(n) === a
              ? state.social[n].banned
                ? (e.textContent = "This account has been banned.")
                : openSocialAccount(n)
              : (e.textContent = "Incorrect username or password.");
          });
        const s = (e, t, a) => (
            (o(t).textContent = a || ""),
            e && (o(e).classList.toggle("q18bad", !!a), o(e).classList.toggle("q18good", !a)),
            !a
          ),
          r = () =>
            s(
              "q18bdb",
              "q18vb",
              +o("q18m").value && +o("q18d").value && +o("q18y").value ? "" : "Invalid birthday",
            ),
          i = () => {
            const e = String(o("q18n").value || ""),
              t =
                e.length < 3 || e.length > 20
                  ? "Usernames can be 3 to 20 characters long."
                  : /^[A-Za-z0-9_]+$/.test(e)
                    ? /^_|_$/.test(e)
                      ? "Username can't start or end with _."
                      : (e.match(/_/g) || []).length > 1
                        ? "Usernames can have at most one _."
                        : isBadName(e)
                          ? "Username not appropriate for Roblox."
                          : ((e) => {
                                const t = npcOwner("roblox", e);
                                return !(
                                  (t && !t.sold) ||
                                  Object.keys(state.social).some(
                                    (t) =>
                                      "roblox" === socBase(t) &&
                                      String(state.social[t].handle || "").toLowerCase() === e,
                                  )
                                );
                              })(e.toLowerCase())
                            ? ""
                            : "This username is already in use."
                    : "Only a-z, A-Z, 0-9, and _ are allowed.";
            return s("q18n", "q18vn", t);
          },
          l = () => {
            const e = o("q18a").value,
              t =
                e.length < 8
                  ? "Passwords must be at least 8 characters long."
                  : e.toLowerCase() === String(o("q18n").value || "").toLowerCase()
                    ? "Password shouldn't match username."
                    : /^(.)\1+$|^(password|12345678|abcdefgh|qwertyui)/i.test(e)
                      ? "Please create a more complex password."
                      : "";
            return s("q18a", "q18va", t);
          },
          c = () =>
            s(
              "q18c",
              "q18vc",
              o("q18c").value && o("q18c").value === o("q18a").value ? "" : "Passwords do not match",
            ),
          d = () => s("q18gb", "q18vg", n ? "" : "Gender is required");
        ["q18m", "q18d", "q18y"].forEach((e) => (o(e).onchange = r)),
          (o("q18n").onblur = i),
          (o("q18a").onblur = l),
          (o("q18c").oninput = c),
          pwAutofill(o("q18a"), [o("q18a"), o("q18c")], 200),
          [
            ["q18gf", 3],
            ["q18gm", 2],
          ].forEach(
            ([e, t]) =>
              (o(e).onclick = () => {
                play("choice"),
                  (n = t),
                  o("q18gf").classList.toggle("q18sel", 3 === t),
                  o("q18gm").classList.toggle("q18sel", 2 === t),
                  d();
              }),
          ),
          (o("q18go").onclick = () => {
            play("choice");
            const a = [r(), i(), l(), c(), d()].every(Boolean),
              n = o("q18tos").checked;
            if (
              ((o("q18vt").textContent = n ? "" : "Please agree to our Terms of Use and Privacy Policy"),
              !a || !n)
            )
              return;
            const s = e || (t[0] && t[0].addr),
              u = o("q18n").value.toLowerCase(),
              h = o("q18a").value,
              p = rbxNewKey();
            socialSignup(p, s, u);
            const m = state.social[p];
            m && ((m.pw = h), (m.pwY = socYear()), (m.handle = u)), openSocialAccount(p);
          }),
          screen.classList.add("open");
      }
      const RBX17_CSS =
        "<style>\n    @font-face{font-family:'SSP14';font-weight:400;src:url(social/roblox/ssp400.woff) format('woff')}\n    @font-face{font-family:'SSP14';font-weight:600;src:url(social/roblox/ssp600.woff) format('woff')}\n    @font-face{font-family:'SSP14';font-weight:700;src:url(social/roblox/ssp700.woff) format('woff')}\n    .rb17{background:#fff;color:#343434;font-family:'SSP14','Source Sans Pro',Arial,Helvetica,sans-serif;font-size:14px;line-height:1.428;min-height:100%}\n    .rb17 .q17hd{background:#0074bd;height:46px;display:flex;align-items:center;justify-content:space-between;padding:0 8px}\n    .rb17 .q17hd i{display:block;width:118px;height:30px;background:url(social/roblox/2017-logo.svg) 0 0/118px 30px no-repeat}\n    .rb17 .q17hd span{color:#fff;font-size:16px;padding:6px 9px;cursor:pointer}\n    .rb17 .q17bd{padding:10px 14px 0}\n    .rb17 h1{font-size:30px;font-weight:700;color:#363636;letter-spacing:-2px;margin:4px 0 12px;line-height:1.1}\n    .rb17 .q17tb td{padding:0 0 14px}\n    .rb17 .q17lbl{font-size:14px;font-weight:600;color:#343434;padding-right:5px !important;white-space:nowrap}\n    .rb17 .q17in{width:100%;height:21px;border:1px solid #a7a7a7;padding:0 3px;font:12px Arial,sans-serif;color:#000;background:#fff;box-sizing:border-box}\n    .rb17 .q17row{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px}\n    .rb17 .q17fp{font-size:12px;color:#095fb5;cursor:pointer;line-height:34px}\n    .rb17 .q17bm{display:inline-block;height:34px;padding:1px 13px 3px;min-width:62px;font:400 20px/1.3em 'SSP14','Source Sans Pro',Arial,sans-serif;color:#fff;border:1px solid;cursor:pointer;background-repeat:repeat-x;background-position:left -96px;box-sizing:border-box}\n    .rb17 .q17blue{border-color:#0852b7;background-color:#0852b7;background-image:url(social/roblox/2017-blue.png)}\n    .rb17 .q17gray{border-color:#565656;background-color:#565656;background-image:url(social/roblox/2017-gray.png)}\n    .rb17 .q17green{border-color:#007001;background-color:#007001;background-image:url(social/roblox/2014-green.png)}\n    .rb17 .q17bs{display:inline-block;height:20px;padding:1px 7px 0;min-width:40px;font:400 14px/18px 'SSP14','Source Sans Pro',Arial,sans-serif;color:#fff;border:1px solid #0852b7;background:#0852b7 url(social/roblox/2017-blue.png) left -160px repeat-x;cursor:pointer;box-sizing:border-box;vertical-align:middle}\n    .rb17 .q17fb{display:inline-block;margin:6px 0 4px;height:25px;padding:7px 8px 0;background:url(social/roblox/2017-fbmid.png) left top repeat-x;color:#fff;font-size:12px;line-height:14px;cursor:pointer;box-sizing:border-box;border-radius:2px}\n    .rb17 .q17w{color:#d86868;font-size:12px;min-height:16px}\n    .rb17 .q17div{border-bottom:1px solid #ccc;padding-bottom:12px}\n    .rb17 .q17su{text-align:center;padding:12px 0 14px;border-bottom:1px solid #ccc}\n    .rb17 .q17su p{font-size:12px;margin:0 0 5px}\n    .rb17 .q17su h2,.rb17 .q17ga h2{font-size:22px;font-weight:400;letter-spacing:-1px;color:#343434;margin:0 0 8px;line-height:1.2}\n    .rb17 .q17ga{padding:14px 0 6px}\n    .rb17 .q17ga p{font-size:16px;margin:0;line-height:1.6}\n    .rb17 .q17fl{display:flex;flex-wrap:wrap;justify-content:center;gap:2px 16px;padding:14px 10px 4px;border-top:1px solid #e3e3e3;margin-top:14px}\n    .rb17 .q17fl a{color:#b8b8b8;font-size:18px;font-weight:400;cursor:pointer}\n    .rb17 .q17fl a.q17pv{color:#00a2ff}\n    .rb17 .q17cp{text-align:center;font-size:10px;color:#b8b8b8;padding:6px 0 16px}\n    .rb17 select{height:24px;border:1px solid #a7a7a7;font:13px Arial,sans-serif;color:#000;background:#fff;margin-right:4px}\n    .rb17 .q17gd{display:flex;gap:14px;font-size:14px}\n    .rb17 .q17ds{font-size:12px;color:#757575;margin:2px 0 10px}\n    .rb17 .q17fh{font-size:14px;font-weight:600;margin:0 0 3px}\n  </style>";
      function rbxFoot17() {
        return '<div class="q17fl"><a>About Us</a><a>Jobs</a><a>Blog</a><a>Parents</a><a>Help</a><a>Terms</a><a class="q17pv">Privacy</a></div><div class="q17cp">&copy;2016 ROBLOX Corporation</div>';
      }
      function rbxLogin2017(e) {
        (sTitle.textContent = "ROBLOX"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial),
          (sList.innerHTML =
            RBX17_CSS +
            `<div class="rb17"><div class="q17hd"><i></i><div><span id="q17hl">Log In</span><span id="q17hs">Sign Up</span></div></div><div class="q17bd">\n      <h1>Login to ROBLOX</h1>\n      <div class="q17div"><table class="q17tb" style="width:100%;border-collapse:collapse"><tr><td class="q17lbl">Username:</td><td><input class="q17in" id="q17u" autocomplete="off" spellcheck="false"></td></tr>\n        <tr><td class="q17lbl">Password:</td><td><input class="q17in" id="q17p" type="password" autocomplete="off"></td></tr></table>\n        <div class="q17w" id="q17w"></div>\n        <div class="q17row"><a class="q17fp" id="q17fg">Forgot your password?</a><div><a class="q17bm q17blue" id="q17in">Sign In</a> <a class="q17bm q17gray" id="q17cx">Cancel</a></div></div>\n        <a class="q17fb" id="q17fb">Sign In with Facebook</a></div>\n      <div class="q17su"><p>Not a member?</p><h2>Sign Up to Build &amp; Make Friends</h2><a class="q17bm q17green" id="q17go">Sign Up</a></div>\n      <div class="q17ga"><h2>You don't need an account to play ROBLOX</h2><p>You can start playing right now, in guest mode! <a class="q17bs" id="q17gs">Play as Guest</a></p></div></div>${rbxFoot17()}</div>`),
          (sList.scrollTop = 0);
        const t = (e) => document.getElementById(e),
          a = t("q17w");
        pwAutofill(t("q17p"), [t("q17p")], 20),
          (t("q17in").onclick = () => {
            play("choice"), (a.textContent = "");
            const e = String(t("q17u").value || "")
                .trim()
                .toLowerCase(),
              o = t("q17p").value;
            if (!e) return void (a.textContent = "You must enter a username.");
            if (!o) return void (a.textContent = "You must enter a password.");
            const n = Object.keys(state.social).find(
              (t) =>
                "roblox" === socBase(t) &&
                !state.social[t].stranger &&
                String(state.social[t].handle || "").toLowerCase() === e,
            );
            n && pwOf(n) === o
              ? state.social[n].banned
                ? (a.textContent = "This account has been banned.")
                : openSocialAccount(n)
              : (a.textContent = "Your username or password is incorrect. Please check them and try again.");
          }),
          (t("q17cx").onclick = () => {
            play("choice"), openSocial();
          }),
          (t("q17fg").onclick = () => {
            play("choice"), (a.textContent = "Check your email for a link to reset your password.");
          }),
          (t("q17go").onclick = t("q17hs").onclick =
            () => {
              play("choice"), rbxSignup2017(e);
            }),
          (t("q17hl").onclick = () => {
            play("choice"), t("q17u").focus();
          }),
          (t("q17gs").onclick = () => {
            play("choice"),
              say("I played ROBLOX as a guest."),
              fx({ Happiness: rint(1, 4) }, ""),
              notice(
                "Guest Mode",
                "You played a few ROBLOX games as a guest. Nothing you do is saved without an account.",
                null,
                !0,
              );
          }),
          (t("q17fb").onclick = () => {
            play("choice"), (a.textContent = "");
            const t = (state.emails || []).filter((e) => !e.hacked),
              o = Object.keys(state.social).find(
                (e) => "facebook" === socBase(e) && !state.social[e].stranger && !state.social[e].banned,
              );
            if (!o) return void (a.textContent = "You need a Facebook account to sign in with Facebook.");
            const n = state.social[o],
              s = cleanHandle(document.getElementById("pname").textContent.replace(/\s+/g, "")) || "user",
              r = n.email || e || (t[0] && t[0].addr);
            let i =
              handleOf(o)
                .toLowerCase()
                .replace(/[^a-z0-9_]/g, "")
                .slice(0, 20) || s;
            (i.length < 3 ||
              !((e) => {
                const t = npcOwner("roblox", e);
                return !(
                  (t && !t.sold) ||
                  Object.keys(state.social).some(
                    (t) =>
                      "roblox" === socBase(t) && String(state.social[t].handle || "").toLowerCase() === e,
                  )
                );
              })(i)) &&
              (i = `${i.slice(0, 15)}${rint(10, 9999)}`);
            const l = rbxNewKey();
            socialSignup(l, r, i);
            const c = state.social[l];
            c && ((c.pw = pwOf(o)), (c.pwY = socYear()), (c.handle = i), (c.viaFacebook = !0)),
              openSocialAccount(l);
          }),
          screen.classList.add("open");
      }
      function rbxSignup2017(e) {
        const t = (state.emails || []).filter((e) => !e.hacked),
          a = socYear();
        (sTitle.textContent = "ROBLOX"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => rbxLogin2017(e)),
          (sList.innerHTML =
            RBX17_CSS +
            `<div class="rb17"><div class="q17hd"><i></i><div><span id="q17hl">Log In</span><span>Sign Up</span></div></div><div class="q17bd">\n      <h1>Sign Up to Build &amp; Make Friends</h1>\n      <div class="q17fh">Birthday</div><div><select id="q17m"><option value="0">Month</option>${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((e, t) => `<option value="${t + 1}">${e}</option>`).join("")}</select><select id="q17d"><option value="0">Day</option>${Array.from({ length: 31 }, (e, t) => `<option>${t + 1}</option>`).join("")}</select><select id="q17y"><option value="0">Year</option>${Array.from(
              { length: 100 },
              (e, t) => a - t,
            )
              .map((e) => `<option>${e}</option>`)
              .join(
                "",
              )}</select></div>\n      <div class="q17ds">Enter your birthday for a personalized experience.</div>\n      <div class="q17fh">Username</div><input class="q17in" id="q17n" maxlength="20" autocomplete="off" spellcheck="false"><div class="q17ds">3-20 alphanumeric characters, no spaces</div>\n      <div class="q17fh">Password</div><input class="q17in" id="q17a" type="password" maxlength="20" autocomplete="off"><div class="q17ds">8-20 characters, minimum of 4 letters &amp; 1 number</div>\n      <div class="q17fh">Gender</div><div class="q17gd"><label><input type="radio" name="q17gen" value="m"> Male</label><label><input type="radio" name="q17gen" value="f"> Female</label></div>\n      <div class="q17w" id="q17sw" style="margin-top:8px"></div>\n      <a class="q17bm q17green" id="q17mk" style="width:100%;text-align:center;margin-top:4px">Sign Up</a></div>${rbxFoot17()}</div>`),
          (sList.scrollTop = 0);
        const o = (e) => document.getElementById(e),
          n = o("q17sw");
        (o("q17hl").onclick = () => {
          play("choice"), rbxLogin2017(e);
        }),
          pwAutofill(o("q17a"), [o("q17a")], 20),
          (o("q17mk").onclick = () => {
            play("choice"), (n.textContent = "");
            const a = String(o("q17n").value || ""),
              s = o("q17a").value,
              r = (s.match(/[A-Za-z]/g) || []).length,
              i = (s.match(/[0-9]/g) || []).length,
              l = a.toLowerCase();
            if (!(+o("q17m").value && +o("q17d").value && +o("q17y").value))
              return void (n.textContent = "Birthday is required.");
            if (!/^[A-Za-z0-9]{3,20}$/.test(a))
              return void (n.textContent =
                "Usernames can be 3 to 20 characters long and only letters and numbers.");
            if (isBadName(a)) return void (n.textContent = "Username not appropriate for ROBLOX.");
            const c = npcOwner("roblox", l);
            if (
              (c && !c.sold) ||
              Object.keys(state.social).some(
                (e) => "roblox" === socBase(e) && String(state.social[e].handle || "").toLowerCase() === l,
              )
            )
              return void (n.textContent = "This username is already in use.");
            if (s.length < 8 || s.length > 20 || r < 4 || i < 1 || /\s/.test(s))
              return void (n.textContent =
                "Passwords must be 8-20 characters with at least 4 letters and 1 number.");
            if (s.toLowerCase() === l) return void (n.textContent = "Password shouldn't match username.");
            if (!document.querySelector('input[name="q17gen"]:checked'))
              return void (n.textContent = "Gender is required.");
            const d = e || (t[0] && t[0].addr),
              u = rbxNewKey();
            socialSignup(u, d, l);
            const h = state.social[u];
            h && ((h.pw = s), (h.pwY = socYear()), (h.handle = l)), openSocialAccount(u);
          }),
          screen.classList.add("open");
      }
      const RBX14_CSS =
        "<style>\n    @font-face{font-family:'SSP14';font-weight:400;src:url(social/roblox/ssp400.woff) format('woff')}\n    @font-face{font-family:'SSP14';font-weight:600;src:url(social/roblox/ssp600.woff) format('woff')}\n    @font-face{font-family:'SSP14';font-weight:700;src:url(social/roblox/ssp700.woff) format('woff')}\n    .rb14{background:#2f5fa8 url(social/roblox/2014-bg.jpg) center top/cover no-repeat;color:#fff;font-family:'SSP14','Source Sans Pro',Arial,sans-serif;min-height:100%;padding:18px 0 0}\n    .rb14 .q14lg{display:block;width:150px;margin:0 auto}\n    .rb14 .q14t1{font-size:30px;font-weight:700;letter-spacing:-1px;text-align:center;margin:4px 0 0;line-height:1.1}\n    .rb14 .q14t2{font-size:21px;font-weight:700;text-align:center;margin:2px 0 14px}\n    .rb14 .q14im{display:block;width:84%;max-width:300px;margin:0 auto}\n    .rb14 .q14sl{font-size:20px;font-weight:700;letter-spacing:-1px;text-align:center;margin:6px 0 14px}\n    .rb14 .q14bx{background:rgba(3,56,108,.5);margin:0 auto;width:86%;max-width:300px;padding:16px 20px 18px;box-sizing:border-box}\n    .rb14 .q14tb{margin:0 0 6px}\n    .rb14 .q14tab{font-size:16px;font-weight:400;color:#9cf;cursor:pointer}\n    .rb14 .q14tab.q14on{color:#fff;font-size:18px;font-weight:700}\n    .rb14 .q14row{margin:0 0 6px}\n    .rb14 .q14lb{display:flex;justify-content:space-between;font-size:13.5px;margin:0 0 3px}\n    .rb14 .q14lb em{font-style:normal;font-size:12px;color:#ffb3b3}\n    .rb14 .q14lb em.q14ok{color:#daff7f}\n    .rb14 select{height:22px;font:13px Arial,sans-serif;color:#000;background:#fff;border:1px solid #a7a7a7;margin-right:4px}\n    .rb14 .q14in{width:100%;height:25px;border:1px solid #a7a7a7;padding:0 3px;font:13px Arial,sans-serif;color:#000;background:#fff;box-sizing:border-box}\n    .rb14 .q14ds{font-size:11.5px;line-height:1.55;margin-top:2px}\n    .rb14 .q14gd{font-size:13.5px;display:flex;gap:14px;align-items:center}\n    .rb14 .q14gd input{margin:0 3px 0 0;vertical-align:-2px}\n    .rb14 .q14btn{display:block;width:100%;height:48px;margin:10px 0 0;padding:0;border:1px solid #007001;background:#007001 url(social/roblox/2014-green.png) left 0 repeat-x;color:#fff;font:400 22px 'SSP14','Source Sans Pro',Arial,sans-serif;cursor:pointer}\n    .rb14 .q14btn:active{background-position:left -48px}\n    .rb14 .q14ft{background:#123f83;margin-top:22px;padding:14px 14px 16px;text-align:center}\n    .rb14 .q14ft p{font-size:12.5px;color:#899fc1;margin:0 0 8px}\n    .rb14 .q14ft p a{color:#fff;text-decoration:none}\n    .rb14 .q14ft .q14lgl{border-top:1px solid #335d99;padding-top:8px;font-size:10px;line-height:17px;color:#899fc1;text-align:left}\n    .rb14 .q14ft .q14lgl a{color:#fff;text-decoration:none}\n    .rb14 .q14lf{text-align:center;font-size:13px;margin-top:14px;line-height:1.6}\n    .rb14 .q14lf a{color:#fff;cursor:pointer}\n  </style>";
      function rbxSignup2014(e, t = "signup") {
        const a = (state.emails || []).filter((e) => !e.hacked),
          o = socYear(),
          n = (state.birthYear, (e, t) => `<div class="q14lb"><span>${t}</span><em id="${e}"></em></div>`);
        (sTitle.textContent = "ROBLOX"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial);
        const s = `<div class="q14row">${n("k14b", "Birthday")}<select id="k14m"><option value="0">Month</option>${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((e, t) => `<option value="${t + 1}">${e}</option>`).join("")}</select><select id="k14d"><option value="0">Day</option>${Array.from({ length: 31 }, (e, t) => `<option>${t + 1}</option>`).join("")}</select><select id="k14y"><option value="0">Year</option>${Array.from(
            { length: 100 },
            (e, t) => o - 1 - t,
          )
            .map((e) => `<option>${e}</option>`)
            .join(
              "",
            )}</select>\n        <div class="q14ds">Enter your birthday for a personalized experience.<br>It will not be given to any third party.</div></div>\n      <div class="q14row">${n("k14g", "Gender")}<div class="q14gd"><label><input type="radio" name="k14gen" value="m">Male</label><label><input type="radio" name="k14gen" value="f">Female</label></div></div>\n      <div class="q14row">${n("k14u", "Username")}<input class="q14in" id="k14n" maxlength="20" autocomplete="off" spellcheck="false"><div class="q14ds">3-20 alphanumeric characters, no spaces</div></div>\n      <div class="q14row">${n("k14p", "Password")}<input class="q14in" id="k14a" type="password" maxlength="20" autocomplete="off"><div class="q14ds">6-20 characters, minimum of 4 letters &amp; 2 numbers</div></div>\n      <div class="q14row">${n("k14c", "Confirm Password")}<input class="q14in" id="k14cf" type="password" maxlength="20" autocomplete="off"></div>\n      <button class="q14btn" id="k14go">Sign Up</button>`,
          r = `<div class="q14row">${n("k14le", "")}<input class="q14in" id="k14lu" placeholder="Username" autocomplete="off" spellcheck="false"></div>\n      <div class="q14row"><input class="q14in" id="k14lp" type="password" placeholder="Password" autocomplete="off"></div>\n      <button class="q14btn" id="k14li">Login</button>\n      <div class="q14lf"><a id="k14fg">Forgot your username/password?</a><br>Don't have an account? <a id="k14ts">Sign up</a></div>`;
        (sList.innerHTML =
          RBX14_CSS +
          `<div class="rb14"><img class="q14lg" src="social/roblox/2014-logo.png" alt="ROBLOX">\n      <div class="q14t1">Join millions of builders</div><div class="q14t2">and explore their creations</div>\n      <img class="q14im" src="social/roblox/2014-shot.jpg" alt=""><div class="q14sl">What will you build?</div>\n      <div class="q14bx"><div class="q14tb"><span class="q14tab${"signup" === t ? " q14on" : ""}" id="k14t1">Sign up</span> <span class="q14tab">|</span> <span class="q14tab${"login" === t ? " q14on" : ""}" id="k14t2">Login</span></div>\n        ${"signup" === t ? s : r}</div>\n      <div class="q14ft"><p><a>Jobs</a> &nbsp;|&nbsp; <a>Blog</a> &nbsp;|&nbsp; <a>Privacy Policy</a> &nbsp;|&nbsp; <a>Parents</a> &nbsp;|&nbsp; <a>Help</a></p>\n        <div class="q14lgl">ROBLOX, "Online Building Toy", characters, logos, names, and all related indicia are trademarks of <a>ROBLOX Corporation</a>, &copy;2014. Patents pending. ROBLOX is not sponsored, authorized or endorsed by any producer of plastic building bricks, including The LEGO Group, MEGA Brands, and K'Nex, and no resemblance to the products of these companies is intended. Use of this site signifies your acceptance of the <a>Terms and Conditions</a>.</div></div></div>`),
          (sList.scrollTop = 0);
        const i = (e) => document.getElementById(e);
        (i("k14t1").onclick = () => {
          "signup" !== t && (play("choice"), rbxSignup2014(e, "signup"));
        }),
          (i("k14t2").onclick = () => {
            "login" !== t && (play("choice"), rbxSignup2014(e, "login"));
          });
        const l = (e, t, a) => {
          const o = i(e);
          return (o.textContent = t), (o.className = a ? "q14ok" : ""), !a;
        };
        if ("login" === t)
          return (
            pwAutofill(i("k14lp"), [i("k14lp")], 20),
            (i("k14ts").onclick = () => {
              play("choice"), rbxSignup2014(e, "signup");
            }),
            (i("k14fg").onclick = () => {
              play("choice"), l("k14le", "Check your email to reset your password.", !0);
            }),
            (i("k14li").onclick = () => {
              play("choice");
              const e = String(i("k14lu").value || "")
                  .trim()
                  .toLowerCase(),
                t = i("k14lp").value;
              if (!e || !t) return void l("k14le", "Please enter your username and password.");
              const a = Object.keys(state.social).find(
                (t) =>
                  "roblox" === socBase(t) &&
                  !state.social[t].stranger &&
                  String(state.social[t].handle || "").toLowerCase() === e,
              );
              a && pwOf(a) === t
                ? state.social[a].banned
                  ? l("k14le", "This account has been banned.")
                  : openSocialAccount(a)
                : l("k14le", "Incorrect username or password.");
            }),
            screen.classList.add("open")
          );
        pwAutofill(i("k14a"), [i("k14a"), i("k14cf")], 20);
        const c = () =>
            +i("k14m").value && +i("k14d").value && +i("k14y").value
              ? !l("k14b", "OK", !0)
              : l("k14b", "Birthday is required."),
          d = () =>
            document.querySelector('input[name="k14gen"]:checked')
              ? !l("k14g", "OK", !0)
              : l("k14g", "Gender is required."),
          u = () => {
            const e = String(i("k14n").value || "");
            return /^[A-Za-z0-9]{3,20}$/.test(e)
              ? isBadName(e)
                ? !l("k14u", "Username not appropriate.") && !1
                : ((e) => {
                      const t = npcOwner("roblox", e);
                      return !(
                        (t && !t.sold) ||
                        Object.keys(state.social).some(
                          (t) =>
                            "roblox" === socBase(t) &&
                            String(state.social[t].handle || "").toLowerCase() === e,
                        )
                      );
                    })(e.toLowerCase())
                  ? !l("k14u", "OK", !0)
                  : !l("k14u", "Already taken.") && !1
              : !l("k14u", "Invalid username.") && !1;
          },
          h = () => {
            const e = i("k14a").value,
              t = (e.match(/[A-Za-z]/g) || []).length,
              a = (e.match(/[0-9]/g) || []).length;
            if (e.length < 6 || e.length > 20 || t < 4 || a < 2 || /\s/.test(e))
              return !l("k14p", "Invalid password.") && !1;
            if (e.toLowerCase() === String(i("k14n").value || "").toLowerCase())
              return !l("k14p", "Can't match username.") && !1;
            const o = pwReuse(e);
            return !l("k14p", o ? `Used on ${o} other account${o > 1 ? "s" : ""}` : "OK", !o) || !!o;
          },
          p = () =>
            i("k14cf").value && i("k14cf").value === i("k14a").value
              ? !l("k14c", "OK", !0)
              : l("k14c", "Passwords don't match.");
        ["k14m", "k14d", "k14y"].forEach((e) => (i(e).onchange = c)),
          document.querySelectorAll('input[name="k14gen"]').forEach((e) => (e.onclick = d)),
          (i("k14n").onblur = u),
          (i("k14a").onkeyup = h),
          (i("k14cf").onkeyup = p),
          (i("k14go").onclick = () => {
            play("choice");
            if (![c(), d(), u(), h(), p()].every(Boolean)) return;
            const t = e || (a[0] && a[0].addr),
              o = i("k14n").value.toLowerCase(),
              n = i("k14a").value,
              s = rbxNewKey();
            socialSignup(s, t, o);
            const r = state.social[s];
            r && ((r.pw = n), (r.pwY = socYear()), (r.handle = o)), openSocialAccount(s);
          }),
          screen.classList.add("open");
      }
      const RBX13_CSS =
        "<style>\n    .rb13{background:#fff;color:#000;font-family:Arial,Helvetica,sans-serif;min-height:100%;padding:0 0 14px}\n    .rb13 .q13hd{background:#114081;height:38px;display:flex;align-items:center;padding-left:8px}\n    .rb13 .q13hd i{display:block;width:123px;height:38px;background:url(social/roblox/2013-logo.png) 0 0 no-repeat}\n    .rb13 .q13bx{background:#e1e1e1;border:1px solid #bcbcbc;margin:18px auto 0;width:88%;max-width:300px;padding:0 10px 12px;text-align:center;box-sizing:border-box}\n    .rb13 .q13h{font:700 16px Arial,sans-serif;text-transform:uppercase;padding:8px 0 5px}\n    .rb13 .q13r{display:flex;align-items:center;justify-content:center;gap:4px;margin:0 0 10px}\n    .rb13 .q13r label{font:700 11px Arial,sans-serif;color:#000;min-width:62px;text-align:left}\n    .rb13 .q13r input,.rb13 .q13r select{width:60%;height:20px;border:1px solid #bcbcbc;font:12px Arial,sans-serif;padding:0 3px;box-sizing:border-box;background:#fff;color:#000}\n    .rb13 .q13r select.q13s{width:auto;flex:1}\n    .rb13 a.q13l{display:block;font-size:11px;color:#0055b3;text-decoration:none;margin:-6px 0 0 50px;text-align:left;cursor:pointer}\n    .rb13 .q13si{display:block;box-sizing:content-box;margin:9px auto 0;width:88px;height:18px;padding:6px 0;background:url(social/roblox/2013-silver.png) 0 0 repeat-x;border:1px solid #bcbcbc;font:700 16px Arial,sans-serif;color:#000;cursor:pointer;line-height:18px}\n    .rb13 .q13si:active{background-position:0 -30px}\n    .rb13 .q13sep{border-top:1px solid #bdbdbd;margin-top:10px;padding-top:6px}\n    .rb13 .q13fb{display:block;width:170px;height:25px;margin:5px auto;background:url(social/roblox/2013-fb.png) 0 0 no-repeat;cursor:pointer}\n    .rb13 .q13fb:active{background-position:0 -25px}\n    .rb13 .q13nm{display:flex;align-items:center;justify-content:center;gap:5px;font-size:12px;margin-top:8px}\n    .rb13 .q13su{display:block;width:102px;height:34px;background:url(social/roblox/2013-signup.png) 0 0 no-repeat;cursor:pointer;border:0}\n    .rb13 .q13su:active{background-position:0 -34px}\n    .rb13 .q13pn{display:block;width:215px;height:214px;margin:18px auto 0;background:url(social/roblox/2013-playnow.png) 0 0 no-repeat;cursor:pointer;transform:scale(.72);transform-origin:top center;margin-bottom:-60px}\n    .rb13 .q13pn:active{background-position:0 -214px}\n    .rb13 .q13w{font-size:11px;color:#c00;min-height:13px;margin:4px 0 0}\n    .rb13 .q13gd{display:flex;gap:8px;justify-content:center;margin:0 0 10px}\n    .rb13 .q13gd b{font:700 12px Arial,sans-serif;border:1px solid #bcbcbc;background:#fff;padding:4px 14px;cursor:pointer}\n    .rb13 .q13gd b.q13on{background:#114081;color:#fff;border-color:#114081}\n    .rb13 .q13hr{border-top:1px solid #bdbdbd;margin:16px 12px 0}\n    .rb13 .q13ft{font-size:10px;text-align:center;line-height:1.45;margin:8px 12px 0;color:#000}\n    .rb13 .q13ft b a{color:#0055b3;text-decoration:none}\n  </style>";
      function rbxFoot13() {
        return '<div class="q13hr"></div><div class="q13ft"><b><a>Privacy Policy</a></b> &nbsp;|&nbsp; <a style="color:#0055b3">Parents</a> &nbsp;|&nbsp; <a style="color:#0055b3">Help</a><br>\n    ROBLOX, "Online Building Toy", characters, logos, names, and all related indicia are trademarks of ROBLOX Corporation, &copy;2013. Patents pending. ROBLOX is not sponsored, authorized or endorsed by any producer of plastic building bricks, including The LEGO Group, MEGA Brands, and K\'Nex, and no resemblance to the products of these companies is intended. Use of this site signifies your acceptance of the Terms and Conditions.</div>';
      }
      function rbxLogin2013(e) {
        const t = (state.emails || []).filter((e) => !e.hacked);
        (sTitle.textContent = "ROBLOX"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial),
          (sList.innerHTML =
            RBX13_CSS +
            `<div class="rb13"><div class="q13hd"><i></i></div>\n      <div class="q13bx"><div class="q13h">Member Login</div>\n        <div class="q13r"><label>Username:</label><input id="r13u" maxlength="20" autocomplete="off" spellcheck="false"></div>\n        <div class="q13r"><label>Password:</label><input id="r13p" type="password" maxlength="20" autocomplete="off"></div>\n        <a class="q13l" id="r13f">Forget your password?</a>\n        <button class="q13si" id="r13in">Sign In</button><div class="q13w" id="r13w"></div>\n        <div class="q13sep"><i class="q13fb" id="r13fb"></i><div class="q13nm"><span>Not a member?</span><button class="q13su" id="r13su" aria-label="Sign Up"></button></div></div></div>\n      <i class="q13pn" id="r13pn"></i>${rbxFoot13()}</div>`),
          (sList.scrollTop = 0);
        const a = (e) => document.getElementById(e),
          o = a("r13w");
        pwAutofill(a("r13p"), [a("r13p")], 20),
          (a("r13in").onclick = () => {
            play("choice"), (o.textContent = "");
            const e = String(a("r13u").value || "")
                .trim()
                .toLowerCase(),
              t = a("r13p").value;
            if (!e || !t) return void (o.textContent = "Please enter your username and password.");
            const n = Object.keys(state.social).find(
              (t) =>
                "roblox" === socBase(t) &&
                !state.social[t].stranger &&
                String(state.social[t].handle || "").toLowerCase() === e,
            );
            n && pwOf(n) === t
              ? state.social[n].banned
                ? (o.textContent = "This account has been banned.")
                : openSocialAccount(n)
              : (o.textContent = "Invalid username or password.");
          }),
          (a("r13f").onclick = () => {
            play("choice"), (o.textContent = "A password reset link was sent to your email.");
          }),
          (a("r13su").onclick = a("r13pn").onclick =
            () => {
              play("choice"), rbxSignup2013(e);
            }),
          (a("r13fb").onclick = () => {
            play("choice"), (o.textContent = "");
            const a = Object.keys(state.social).find(
              (e) => "facebook" === socBase(e) && !state.social[e].stranger && !state.social[e].banned,
            );
            if (!a) return void (o.textContent = "You need a Facebook account to log in with Facebook.");
            const n = state.social[a],
              s = cleanHandle(document.getElementById("pname").textContent.replace(/\s+/g, "")) || "user",
              r = n.email || e || (t[0] && t[0].addr);
            let i =
              handleOf(a)
                .toLowerCase()
                .replace(/[^a-z0-9_]/g, "")
                .slice(0, 20) || s;
            (i.length < 3 ||
              !((e) => {
                const t = npcOwner("roblox", e);
                return !(
                  (t && !t.sold) ||
                  Object.keys(state.social).some(
                    (t) =>
                      "roblox" === socBase(t) && String(state.social[t].handle || "").toLowerCase() === e,
                  )
                );
              })(i)) &&
              (i = `${i.slice(0, 15)}${rint(10, 9999)}`);
            const l = rbxNewKey();
            socialSignup(l, r, i);
            const c = state.social[l];
            c && ((c.pw = pwOf(a)), (c.pwY = socYear()), (c.handle = i), (c.viaFacebook = !0)),
              openSocialAccount(l);
          }),
          screen.classList.add("open");
      }
      function rbxSignup2013(e) {
        const t = (state.emails || []).filter((e) => !e.hacked),
          a = socYear(),
          o = state.birthYear,
          n = cleanHandle(document.getElementById("pname").textContent.replace(/\s+/g, "")) || "user";
        (sTitle.textContent = "ROBLOX"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => rbxLogin2013(e)),
          (sList.innerHTML =
            RBX13_CSS +
            `<div class="rb13"><div class="q13hd"><i></i></div>\n      <div class="q13bx"><div class="q13h">Sign Up and Play</div>\n        <div class="q13r"><label>Birthday:</label><select class="q13s" id="r13m">${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((e, t) => `<option value="${t}">${e}</option>`).join("")}</select><select class="q13s" id="r13d">${Array.from({ length: 31 }, (e, t) => `<option>${t + 1}</option>`).join("")}</select><select class="q13s" id="r13y">${Array.from(
              { length: 100 },
              (e, t) => a - t,
            )
              .map((e) => `<option${e === o ? " selected" : ""}>${e}</option>`)
              .join(
                "",
              )}</select></div>\n        <div class="q13gd"><b id="r13gm" class="${"m" === PG() ? "q13on" : ""}">Boy</b><b id="r13gf" class="${"f" === PG() ? "q13on" : ""}">Girl</b></div>\n        <div class="q13r"><label>Username:</label><input id="r13n" maxlength="20" autocomplete="off" spellcheck="false" value="${escAttr(n.slice(0, 20))}"></div>\n        <div class="q13r"><label>Password:</label><input id="r13a" type="password" maxlength="20" autocomplete="off"></div>\n        <div class="q13r"><label>Confirm:</label><input id="r13c" type="password" maxlength="20" autocomplete="off"></div>\n        <div class="q13r"><label>E-mail:</label><select id="r13e">${t.map((t) => `<option${t.addr === e ? " selected" : ""}>${escAttr(t.addr)}</option>`).join("")}</select></div>\n        <div class="q13w" id="r13sw"></div>\n        <i class="q13su" id="r13go" style="margin:6px auto 0"></i></div>${rbxFoot13()}</div>`),
          (sList.scrollTop = 0);
        const s = (e) => document.getElementById(e),
          r = s("r13sw");
        [
          ["r13gm", "r13gf"],
          ["r13gf", "r13gm"],
        ].forEach(([e, t]) => {
          s(e).onclick = () => {
            play("choice"), s(e).classList.add("q13on"), s(t).classList.remove("q13on");
          };
        }),
          pwAutofill(s("r13a"), [s("r13a"), s("r13c")], 20),
          (s("r13a").oninput = () => {
            const e = s("r13a").value,
              t = e && pwReuse(e);
            r.textContent = t
              ? `You already use this password on ${t} other account${t > 1 ? "s" : ""}.`
              : "";
          }),
          (s("r13go").onclick = () => {
            play("choice"), (r.textContent = "");
            const e = String(s("r13n").value || "")
                .toLowerCase()
                .replace(/[^a-z0-9_]/g, "")
                .slice(0, 20),
              t = s("r13a").value,
              a = s("r13c").value,
              o = s("r13e").value;
            if (e.length < 3) return void (r.textContent = "Username must be 3-20 characters.");
            if (isBadName(s("r13n").value) || isBadName(e))
              return void (r.textContent = "That username is not appropriate for ROBLOX.");
            const n = npcOwner("roblox", e);
            if (
              (n && !n.sold) ||
              Object.keys(state.social).some(
                (t) => "roblox" === socBase(t) && String(state.social[t].handle || "").toLowerCase() === e,
              )
            )
              return void (r.textContent = "This username is already in use.");
            if (t.length < 4 || /\s/.test(t))
              return void (r.textContent = "Password must be at least 4 characters with no spaces.");
            if (t !== a) return void (r.textContent = "Passwords do not match.");
            if (!o) return void (r.textContent = "You need an e-mail address to sign up.");
            const i = rbxNewKey();
            socialSignup(i, o, e);
            const l = state.social[i];
            l && ((l.pw = t), (l.pwY = socYear()), (l.handle = e)), openSocialAccount(i);
          }),
          screen.classList.add("open");
      }
      const RBX06H_CSS =
        "<style>\n    .rh06{background:#fff;color:#000;font:12px Verdana,Arial,Helvetica,sans-serif;min-height:100%;padding:0 6px 12px}\n    .rh06 *{font-family:Verdana,Arial,Helvetica,sans-serif}\n    .rh06 .r6hd{border:1px solid #000;border-bottom:0;background:#4682b4;padding:8px;display:flex;justify-content:space-between;align-items:flex-end}\n    .rh06 .r6hd a{font-size:12px;font-weight:700;color:#fff;text-decoration:none;cursor:pointer}\n    .rh06 .r6mn{border:1px solid #000;background:#b0c4de;text-align:center;padding:0 4px;line-height:2em}\n    .rh06 .r6mn a{color:#fff;font-size:15px;text-decoration:none;cursor:pointer}\n    .rh06 .r6mn span{color:#fff;font-size:15px}\n    .rh06 .r6t{font-size:18px;margin:14px 0 10px;text-align:center}\n    .rh06 p{font-size:12px;text-align:center;margin:0 0 12px;line-height:1.3}\n    .rh06 a.r6lk{color:#00e;text-decoration:underline;cursor:pointer}\n    .rh06 .r6lg{border:1px solid #4682b4;padding:8px 6px;margin:6px 8px 14px}\n    .rh06 .r6lg table{width:100%;border-collapse:separate;border-spacing:4px}\n    .rh06 .r6lg td{font-size:12px;vertical-align:middle}\n    .rh06 .r6lg input[type=text],.rh06 .r6lg input[type=password]{width:100%;height:20px;border:1px solid #7f9db9;font:12px Verdana,sans-serif;padding:1px 3px;box-sizing:border-box;background:#fff;color:#000}\n    .rh06 .r6bt{text-align:center;margin:12px 0 10px}\n    .rh06 .r6bt button{font:12px Verdana,sans-serif;color:#000;background:#ece9d8;border:1px solid #707070;border-radius:3px;padding:3px 8px;margin:0 2px;cursor:pointer}\n    .rh06 .r6w{color:#c00;font-size:11px;text-align:center;min-height:13px}\n    .rh06 .r6rs{text-align:center}\n    .rh06 .r6bx{background:#b0c4de;padding:8px;margin:0 0 12px}\n    .rh06 .r6bx .r6t{margin:4px 0 10px}\n    .rh06 .r6pp{display:grid;grid-template-columns:repeat(3,1fr);gap:16px 4px;text-align:center;margin-bottom:12px}\n    .rh06 .r6pp a{color:#00e;text-decoration:none;font-size:12px;cursor:pointer}\n    .rh06 .r6ra{text-align:right}\n    .rh06 .r6cp{text-align:center;margin:0 0 14px}\n    .rh06 .r6cp img{width:88%;max-width:300px;height:auto;border:0}\n    .rh06 .r6rv{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;justify-items:center;margin-bottom:10px}\n    .rh06 .r6rv img{width:120px;height:70px;border:0}\n    .rh06 hr{margin:12px 0 6px}\n    .rh06 .r6lgl{font-size:9px;text-align:center;line-height:1.5}\n    .rh06 .r6lgl a{font-size:9px;color:#00e;text-decoration:underline;cursor:pointer}\n  </style>";
      function rbxHome2006(e) {
        (sTitle.textContent = "ROBLOX"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial);
        (sList.innerHTML =
          RBX06H_CSS +
          `<div class="rh06"><div class="r6hd"><a>ROBLOX.com (Alpha-test)</a><a id="r6hs">Sign Up</a></div>\n      <div class="r6mn"><a>Home</a><span>&nbsp;|&nbsp;</span><a>Browse</a><span>&nbsp;|&nbsp;</span><a>Multiplayer</a><span>&nbsp;|&nbsp;</span><a>Forum</a><span>&nbsp;|&nbsp;</span><a>Info</a></div>\n      <div class="r6t">Welcome to ROBLOX!</div>\n      <p>To get started, simply choose a character and visit somebody's Place. When you visit your own place, changes that you make are permanent. Changes to someone elses place are not permanent.</p>\n      <p>Consult the <a class="r6lk">developer section</a> in the coming days to learn how to create complex Places, how to create and publish Things, and how to work offline.</p>\n      <p>Please enter feedback and bugs in the <a class="r6lk">forums</a>. Thank you from the ROBLOX team.</p>\n      <div class="r6lg"><table><tr><td>Username or E-mail:</td><td><input type="text" id="r6u" autocomplete="off" spellcheck="false"></td></tr>\n        <tr><td>Password:</td><td><input type="password" id="r6p" autocomplete="off"></td></tr></table>\n        <div class="r6bt"><button id="r6in">Log In</button> <button id="r6su">Sign Up!</button></div><div class="r6w" id="r6w"></div>\n        <div class="r6rs"><a class="r6lk" id="r6rs">Reset password</a></div></div>\n      <div class="r6bx"><div class="r6t">Newest&nbsp;People</div><div class="r6pp">${["robbie", "robish", "calebmei", "lurcher", "lassabe", "mitiguy", "pcgt", "samsmart25", "MattDusek"].map((e) => `<a>${e}</a>`).join("")}</div><div class="r6ra"><a class="r6lk">Browse All People</a></div></div>\n      <div class="r6t">Cool Place</div><div class="r6cp"><img src="social/roblox/2006-place.jpg" alt="Flayra's Place" title="Flayra's Place"></div>\n      <div class="r6bx"><div class="r6t">Recently Visited Places</div><div class="r6rv">${["robbie's Place", "lurcher's Place", "pcgt's Place", "robish's Place"].map((e) => `<img src="social/roblox/2006-place.jpg" alt="${e}" title="${e}">`).join("")}</div><div class="r6ra"><a class="r6lk">Browse All Places</a></div></div>\n      <hr><div class="r6lgl">ROBLOX, "Online Building Toy", characters, logos, names and all related indicia are trademarks of <a>ROBLOX Corporation</a>, 2006 . Patents pending.<br>\n        <a>Privacy Policy</a>&nbsp;| <a>Contact Us</a>&nbsp;| <a>About Us</a><br>Use of this site signifies your acceptance of the <a>Terms and Conditions</a></div></div>`),
          (sList.scrollTop = 0);
        const t = (e) => document.getElementById(e),
          a = t("r6w");
        pwAutofill(t("r6p"), [t("r6p")], 10),
          (t("r6in").onclick = () => {
            play("choice"), (a.textContent = "");
            const e = String(t("r6u").value || "")
                .trim()
                .toLowerCase(),
              o = t("r6p").value;
            if (!e || !o) return void (a.textContent = "Please enter your username and password.");
            const n = Object.keys(state.social).find(
              (t) =>
                "roblox" === socBase(t) &&
                !state.social[t].stranger &&
                (String(state.social[t].handle || "").toLowerCase() === e ||
                  String(state.social[t].email || "").toLowerCase() === e),
            );
            n && pwOf(n) === o
              ? state.social[n].banned
                ? (a.textContent = "This account has been banned.")
                : openSocialAccount(n)
              : (a.textContent = "Your login attempt was not successful. Please try again.");
          }),
          (t("r6su").onclick = t("r6hs").onclick =
            () => {
              play("choice"), rbxSignup2006(e);
            }),
          (t("r6rs").onclick = () => {
            play("choice");
            const e = String(t("r6u").value || "").trim();
            a.textContent = e
              ? `An email with instructions has been sent to ${e}`
              : "Enter your username or e-mail first.";
          }),
          screen.classList.add("open");
      }
      function rbxSignup2006(e, t) {
        const a = (state.emails || []).filter((e) => !e.hacked);
        (sTitle.textContent = "ROBLOX"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => rbxHome2006(e));
        const o = cleanHandle(document.getElementById("pname").textContent.replace(/\s+/g, "")) || "user";
        (sList.innerHTML =
          RBX06_CSS +
          `<div class="rb06"><img class="bn" src="social/roblox/signup2006-banner.png" alt="ROBLOX"><div class="pg">\n      <h3>Download and Play - Step 1 of 2</h3>\n      <h4>Choose a name for you ROBLOX character</h4>\n      <div class="f">Character name: <input id="r6n" maxlength="20" autocomplete="off" spellcheck="false" value="${escAttr(o.slice(0, 20))}"></div>\n      <div class="hint">Use 2-20 characters: A-Z, a-z, 0-9</div><div class="warn" id="r6nw"></div>\n      <h4>Choose your ROBLOX password</h4>\n      <div class="f">Password: <input id="r6p" type="password" maxlength="10" autocomplete="off"></div>\n      <div class="f">Confirm password: <input id="r6c" type="password" maxlength="10" autocomplete="off"></div>\n      <div class="hint">4-10 characters, no spaces</div><div class="warn" id="r6pw"></div>\n      <h4>E-mail Address</h4>\n      <div class="f"><select id="r6e">${a.map((t) => `<option${t.addr === e ? " selected" : ""}>${escAttr(t.addr)}</option>`).join("")}</select></div>\n      <div class="hint">This will allow you to recover a lost password</div>\n      <button class="reg" id="r6go">Register</button></div>\n      <div class="side"><b>Already Registerd?</b>If you have already registered your character but you still need to download the installer, go directly to <a>download</a>.<br><br>\n        ROBLOX will not share your email address with 3rd parties. See our <a>Privacy Policy</a> for details.</div>\n      <div class="ft">ROBLOX, "Online Building Toy", characters, logos, names, and all related indicia are trademarks of ROBLOX Corporation, 2006. Patents pending.</div></div>`),
          (sList.scrollTop = 0);
        const n = (e) => document.getElementById(e),
          s = n("r6nw"),
          r = n("r6pw");
        (n("r6p").oninput = () => {
          const e = n("r6p").value,
            t = e && pwReuse(e);
          r.textContent = t ? `You already use this password on ${t} other account${t > 1 ? "s" : ""}.` : "";
        }),
          pwAutofill(n("r6p"), [n("r6p"), n("r6c")], 10),
          (n("r6go").onclick = () => {
            play("choice");
            const e = String(n("r6n").value || "")
                .toLowerCase()
                .replace(/[^a-z0-9._ ]/g, "")
                .replace(/\s+/g, " ")
                .trim()
                .slice(0, 20),
              t = n("r6p").value,
              a = n("r6c").value,
              o = n("r6e").value;
            if (isBadName(n("r6n").value) || isBadName(e))
              return void (n("r6nw").textContent = "That name is not allowed.");
            if (((s.textContent = ""), (r.textContent = ""), e.length < 2))
              return void (s.textContent = "Character name must be at least 2 characters.");
            const i = npcOwner("roblox", e);
            if (
              (i && !i.sold) ||
              Object.keys(state.social).some(
                (t) => "roblox" === socBase(t) && String(state.social[t].handle || "").toLowerCase() === e,
              )
            )
              return void (s.textContent = "That name is already taken.");
            if (t.length < 4 || /\s/.test(t))
              return void (r.textContent = "Password must be 4-10 characters with no spaces.");
            if (t !== a) return void (r.textContent = "Passwords do not match.");
            const l = rbxNewKey();
            socialSignup(l, o, e);
            const c = state.social[l];
            c && ((c.pw = t), (c.pwY = socYear()), (c.handle = e)), openSocialAccount(l);
          }),
          screen.classList.add("open");
      }
      const RBX10_CSS =
        "<style>\n    .rb10{background:linear-gradient(#1e74d6 0,#3a8ee0 30%,#7fa9c9 60%,#2a3f6a 100%);min-height:100%;padding:0 0 14px;font-family:Arial,Helvetica,sans-serif}\n    .rb10 .bn{display:block;width:100%;height:auto}\n    .rb10 .pn{background:#fff;margin:0 8px;padding:8px;border:1px solid #c9c9c9}\n    .rb10 .in{background:linear-gradient(#f2f2f2,#fff 55%);border:1px solid #cfcfcf;padding:10px 10px 12px;display:flex;gap:10px;align-items:center}\n    .rb10 .rg{flex:1.15;text-align:center}\n    .rb10 .rg h3{font-size:16px;font-weight:700;color:#111;margin:0 0 8px}\n    .rb10 .rg label{display:block;font-size:11.5px;font-weight:700;color:#111;margin:6px 0 2px}\n    .rb10 .rg input,.rb10 .rg select{width:92%;height:22px;border:1px solid #888;font:12px Arial,sans-serif;padding:0 3px;background:#fff;color:#000;box-sizing:border-box}\n    .rb10 .bt{display:block;width:76%;margin:10px auto 0;padding:5px 0;background:#3d5a78;border:1px solid #2a3f55;color:#fff;font:700 14px Tahoma,Verdana,sans-serif;cursor:pointer}\n    .rb10 .bt:active{background:#2e475f}\n    .rb10 .fb{display:block;width:96%;margin:12px auto 0;cursor:pointer}\n    .rb10 .warn{font-size:10.5px;color:#c00;min-height:12px;margin-top:4px}\n    .rb10 .pl{flex:1;display:grid;place-items:center}\n    .rb10 .pl div{width:104px;height:104px;border-radius:50%;background:radial-gradient(circle at 50% 35%,#4be04b,#0d9a12 70%,#0a7a0e);border:5px solid #0b6e0f;\n      box-shadow:0 0 0 2px #7fdc7f inset,0 3px 6px rgba(0,0,0,.35);display:grid;place-items:center;text-align:center;color:#fff;font:900 25px/0.95 Arial Black,Arial,sans-serif;text-shadow:0 2px 2px rgba(0,0,0,.4)}\n    .rb10 .ft{color:#fff;font-size:9.5px;text-align:center;line-height:1.45;margin:10px 12px 0;text-shadow:0 1px 1px rgba(0,0,0,.4)}\n    .rb10 .ft b{font-size:11px}\n  </style>";
      function rbxSignup2010(e, t) {
        const a = (state.emails || []).filter((e) => !e.hacked),
          o = socYear();
        (sTitle.textContent = "ROBLOX"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial);
        const n = cleanHandle(document.getElementById("pname").textContent.replace(/\s+/g, "")) || "user";
        (sList.innerHTML =
          RBX10_CSS +
          `<div class="rb10"><img class="bn" src="social/roblox/signup2010-banner.png" alt="ROBLOX"><div class="pn"><div class="in">\n      <div class="rg"><h3>Register</h3>\n        <label>Username:</label><input id="r10n" maxlength="20" autocomplete="off" spellcheck="false" value="${escAttr(n.slice(0, 20))}">\n        <label>Password:</label><input id="r10p" type="password" maxlength="20" autocomplete="off">\n        <label>E-mail:</label><select id="r10e">${a.map((t) => `<option${t.addr === e ? " selected" : ""}>${escAttr(t.addr)}</option>`).join("")}</select>\n        <div class="warn" id="r10w"></div>\n        <button class="bt" id="r10go">Register</button>\n        <img class="fb" id="r10fb" src="social/roblox/fb-signin.png" alt="Sign in with Facebook"></div>\n      <div class="pl"><div>Play<br>Now</div></div></div></div>\n      <div class="ft"><b>Privacy Policy | Parents | Help</b><br>ROBLOX, "Online Building Toy", characters, logos, names, and all related indicia are trademarks of ROBLOX Corporation, &copy;${o}. Patents pending.<br>\n        Use of this site signifies your acceptance of the Terms and Conditions.</div></div>`),
          (sList.scrollTop = 0);
        const s = (e) => document.getElementById(e),
          r = s("r10w"),
          i = (e, t, a, o) => {
            const n = rbxNewKey();
            socialSignup(n, t, e);
            const s = state.social[n];
            s && ((s.pw = a), (s.pwY = socYear()), (s.handle = e), o && (s.viaFacebook = !0)),
              openSocialAccount(n);
          },
          l = (e) => {
            const t = npcOwner("roblox", e);
            return !(
              (t && !t.sold) ||
              Object.keys(state.social).some(
                (t) => "roblox" === socBase(t) && String(state.social[t].handle || "").toLowerCase() === e,
              )
            );
          };
        pwAutofill(s("r10p"), [s("r10p")], 20),
          (s("r10go").onclick = () => {
            play("choice"), (r.textContent = "");
            const e = String(s("r10n").value || "")
                .toLowerCase()
                .replace(/[^a-z0-9_]/g, "")
                .slice(0, 20),
              t = s("r10p").value,
              a = s("r10e").value;
            e.length < 3
              ? (r.textContent = "Username must be at least 3 characters.")
              : isBadName(s("r10n").value) || isBadName(e)
                ? (r.textContent = "That username is not allowed.")
                : l(e)
                  ? t.length < 4
                    ? (r.textContent = "Password must be at least 4 characters.")
                    : i(e, a, t)
                  : (r.textContent = "That username is already taken.");
          }),
          (s("r10fb").onclick = () => {
            play("choice"), (r.textContent = "");
            const t = Object.keys(state.social).find(
              (e) => "facebook" === socBase(e) && !state.social[e].stranger && !state.social[e].banned,
            );
            if (!t) return void (r.textContent = "You need a Facebook account to sign in with Facebook.");
            const o = state.social[t].email || e || (a[0] && a[0].addr);
            let s =
              handleOf(t)
                .toLowerCase()
                .replace(/[^a-z0-9_]/g, "")
                .slice(0, 20) || n;
            (s.length < 3 || !l(s)) && (s = `${s.slice(0, 15)}${rint(10, 9999)}`), i(s, o, pwOf(t), !0);
          }),
          screen.classList.add("open");
      }
      function handleCard(e, t, a, o) {
        const n = socBase(e),
          s = SOC_MINLEN[n] || 1;
        setTimeout(() => {
          (ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div><div class="jm-tag" style="margin-top:12px">Social</div>\n        <h4><img src="${socIcon(n)}" alt=""><span>Username</span></h4>\n        <div class="lead">Pick a username for your new ${t} account (${s}-15 letters, numbers, dots or underscores).</div>\n        <label class="hr-lab">Username:</label><div class="hr-sel txt" style="display:flex;align-items:center"><input id="socName" maxlength="15" autocomplete="off" spellcheck="false"\n          style="flex:1;min-width:0;height:40px;border:none;background:transparent;font:inherit;font-size:17px;padding:0 4px 0 10px" value="${escAttr(a)}">\n          <button id="socRand" aria-label="Random username" style="flex:none;width:32px;height:32px;margin-right:6px;border:none;padding:0;cursor:pointer;background:url(newlife/randomize.png) center/contain no-repeat"></button></div>\n        <button class="jm-apply ev-btn" id="socGo">Use this username</button>`),
            (ev.style.overflow = "visible");
          const r = () => {
              evWrap.classList.remove("open"), (ev.style.overflow = "");
            },
            i = document.getElementById("socName");
          (document.getElementById("propX").onclick = r),
            (document.getElementById("socRand").onclick = () => {
              play("choice");
              const e = randomHandle(s);
              e && (i.value = e),
                document
                  .getElementById("socRand")
                  .animate(
                    [
                      { transform: "rotate(0)" },
                      { transform: "rotate(-90deg) scale(.92)" },
                      { transform: "rotate(0)" },
                    ],
                    { duration: 250 },
                  );
            }),
            (document.getElementById("socGo").onclick = () => {
              const l = cleanFor(n, i.value);
              r();
              const c = () => handleCard(e, t, l || a, o);
              if (isBadName(i.value) || isBadName(l))
                return notice("Not allowed", `${t} doesn't allow that username.`, c, !0);
              if (l.length < s)
                return notice(
                  "Too short",
                  `${t} usernames need at least ${s} character${s > 1 ? "s" : ""}.`,
                  c,
                  !0,
                );
              const d = dcTagged(n) ? null : npcOwner(n, l),
                u = Object.keys(state.social).some(
                  (e) => socBase(e) === n && String(state.social[e].handle || "").toLowerCase() === l,
                );
              if ((d && !d.sold) || u) return notice("Taken", `Someone already has @${l} on ${t}.`, c, !0);
              o(l);
            }),
            evWrap.classList.add("open");
        }, 60);
      }
