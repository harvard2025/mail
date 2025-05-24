document.addEventListener('DOMContentLoaded', function() {

    let emailElement = document.querySelector('#user_email');
    let emailText = emailElement.textContent // الحصول على النص بدون مسافات زائدة
    let username = emailText.split('@')[0]; // استخراج الجزء قبل @
    emailElement.textContent = username; // تحديث العنصر




    // تحديد العناصر
// تحديد العناصر
// تحديد العناصر
// JavaScript لفتح وإغلاق الشريط الجانبي عند الضغط على الزر

    function toggleMenu() {
        document.querySelector('.slidbar').classList.toggle('open');
        const hamburgers = document.querySelectorAll('.hamburger');
        hamburgers.forEach(hamburger => hamburger.classList.toggle('active'));
    }













  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);


  document.querySelector('#compose-form').addEventListener('submit', send_email)



  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#emails-detal-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '@prrocoders.com';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-detal-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3 class='title'>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Get The email From mailbox
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    emails.forEach(singleEmail => {
      const newEmail = document.createElement('div');
      // list-group-item
      newEmail.className = 'new_email'


      let sender = singleEmail.sender // الحصول على النص بدون مسافات زائدة
      let sinder_sp = sender.split('@')[0]; // استخراج الجزء قبل @


      newEmail.innerHTML = `
        <p class='single_sender' >${sinder_sp}</p>
        <p class='single_subject' >${singleEmail.subject}</p>
        <p class='single_time' >${singleEmail.timestamp}</p>
      `;
      newEmail.className = singleEmail.read ? 'read border-style  new_email': 'unread border-style  new_email'
      newEmail.addEventListener('click', function(){
        view_emil(singleEmail.id)
      });
      document.querySelector('#emails-view').append(newEmail);
    });

    // ... do something else with emails ...
});
}

function send_email(event){
  event.preventDefault();

    //
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    // Send to back end

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
        load_mailbox('sent')
    });
}




function view_emil(id){

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    console.log(email.body);
    console.log(email);

    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#emails-detal-view').style.display = 'block';
    document.querySelector('#emails-detal-view').innerHTML =
    `
    <ul class="v_email">

      <li class="sender"><strong></strong>${email.sender}</li>
      <li class="recipients">To: ${email.recipients}</li>

      <li class="timestamp"><strong>at : </strong>${email.timestamp}</li>
      <hr><br>
      <li class="subject"><strong>${email.subject}</strong></li>
      <br>
      <li class="body">${email.body}</li>
    </ul>
    <br><br>

    `;

    // change to read
    if(!email.read){
      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: true
        })
      })
    }

    // Acheve
    const btn_arch = document.createElement('button');
    btn_arch.innerHTML = email.archived ? 'unarchive':'Archive';
    btn_arch.className = email.archived ? 'btn btn-success': 'btn btn-danger';
    btn_arch.addEventListener('click', function() {
      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: !email.archived ? true : false
        })
      })
      .then(() => { load_mailbox('archive')})
    });
    document.querySelector('#emails-detal-view').append(btn_arch);

    // reply
    const btn_reply = document.createElement('button');
    btn_reply.innerHTML = 'Reply';
    btn_reply.className = 'btn btn-info btn_reply';


    btn_reply.addEventListener('click', function() {

      compose_email()
    document.querySelector('#compose-recipients').value = `${email.sender}`;
    let subject = email.subject
    if (subject.split(' ',1)[0] != 'Re:' ){
      subject = 'Re: ' + email.subject
    }
    document.querySelector('#compose-subject').value = subject;
    document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote ${email.body}`;


  });
    document.querySelector('#emails-detal-view').append(btn_reply);
});
}

