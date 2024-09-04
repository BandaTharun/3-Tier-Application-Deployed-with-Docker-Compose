import React from 'react';

function Footer() {
  return (
    <footer className="page-footer font-small" style={{ backgroundColor: '#072d4e', color: '#fff' }}>
      <hr />
      <div className="text-center center-block">
        <br />
        <a href="" target="_blank"><i className="fa fa-linkedin-square fa-3x social" style={{ color: '#fff' }}></i></a>
        <a href="" target="_blank"><i id="social-git" className="fa fa-github-square fa-3x" style={{ color: '#fff' }}></i></a>
      </div>
      <div className="footer-copyright text-center py-3">
        © 2020 <a href="" style={{ color: '#fff' }}>Movie-Recommendation</a>
      </div>
    </footer>
  );
}

export default Footer;
