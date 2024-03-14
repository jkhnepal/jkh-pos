export const resetPasswordTemplate = (newPassword: string) => {
  return ` 
  <div>
    <div class="container">
        <div class="content">
            <p class="heading">Your password has been changed. <span style="color: blue; font-weight: bold;"> ${newPassword}</span> </p>
        </div>

        <div class="footer">
            <p>Thanks and  Regards,</p>
            <p>Jacket House</p>
        </div>
    </div>
  </div>`;
};