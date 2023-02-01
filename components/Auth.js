import { api } from "./API";
import { Form } from "./Form";
import { Input } from "./Input";
import { loginConfig, registerConfig } from "./formConfigs";
import { taskBoard } from "../index";

const getLoginForm = (onSuccess) =>
  new Form({
    title: "Login",
    inputs: loginConfig.map((input) => new Input(input)),
    submitBtnText: "Submit",
    onSubmit: async (data) => {
      await api.login(data);
      onSuccess();
    },
  });

const getRegisterForm = (onSuccess) =>
  new Form({
    title: "Register",
    inputs: registerConfig.map((input) => new Input(input)),
    submitBtnText: "Register",
    onSubmit: async (data) => {
      await api.register(data);
      onSuccess();
    },
  });

export class Auth {
  constructor({ appContainer, onLoginSuccess }) {
    this.appContainer = appContainer;

    this.formContainer = document.createElement("div");
    this.switchBtn = document.createElement("button");
    this.logoutBtn = document.createElement("button");
    this.avatar = document.createElement("span");
    


    this.form = null;
    this.user = null;
    this.isLogin = true; 

    this.loginForm = getLoginForm(onLoginSuccess);
    this.registerForm = getRegisterForm(this.switchForms.bind(this));

    this.createFormContainer();
    this.createHeaderControls();
  }

  createFormContainer() {
    this.formContainer.classList.add("auth-form");
    this.switchBtn.classList.add("btn", "btn-switch");
    this.switchBtn.innerText = "Register";
    this.formContainer.prepend(this.switchBtn);

    this.switchBtn.addEventListener("click", () => {
      this.switchForms();
    });
  }

  createHeaderControls() {
    this.logoutBtn.classList.add("btn", "btn-text");
    this.logoutBtn.innerText = "Logout";
    this.avatar.classList.add("avatar");

    this.logoutBtn.addEventListener("click", () => {
      this.logout();
      api.logout();
      taskBoard.logout();

    });
  }

  renderHeaderName() {
    this.headerContainer = document.querySelector(".header-container");
    this.userName = document.getElementById("user_name");

    this.userName.classList.add("header_title");

    this.userName.innerText = `${this.user.name}'s`;
    
    this.headerContainer.prepend(this.userName);
    
  }

  renderHeaderControls() {

    const controlsContainer = document.getElementById("header-controls");
    this.avatar.innerText = this.user.name[0];


    controlsContainer.append(this.logoutBtn, this.avatar);
  }

  renderAuthForm() {
   
    if (this.form) {
      this.form.form.remove();
    }

    if (this.isLogin) {
      this.form = this.loginForm;
    } else {
      this.form = this.registerForm;
    }

    this.form.render(this.formContainer);
    this.appContainer.append(this.formContainer);
  }

  switchForms() {
   
    this.isLogin = !this.isLogin;

    if (this.isLogin) {
      this.switchBtn.innerText = "Register";
    } else {
      this.switchBtn.innerText = "Login";
    }

    this.renderAuthForm();
  }

  logout() {
    this.avatar.remove();
    this.logoutBtn.remove();
    this.appContainer.innerHTML = "";
    this.isLogin = true;
   
    this.userName.innerText = "Your"
    this.renderAuthForm();
  }
}
