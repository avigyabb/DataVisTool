import DynamicList from "./DynamicList.js";
import User, { Post } from "./User.js";
import EditableText from "./EditableText.js";
import ItemsList from "./ItemsList.js";

class App {
  constructor() {
    this._user = null;
    this._loginForm = null;
    this._postForm = null;
    this._onListUsers = this._onListUsers.bind(this);
    this._onLogin = this._onLogin.bind(this);
    this._followerList = null;
    this._onPost = this._onPost.bind(this);
    this._displayName = new EditableText("displayName");
    this._avatarURL = new EditableText("avatarURL");
    this._email = new EditableText("email");
    this._onNameChange = this._onNameChange.bind(this);
    this._onAvatarChange = this._onAvatarChange.bind(this);
    //this._onEmailChange = this._onEmailChange(this);
    this._acceptItem = this._acceptItem.bind(this);
    this._denyItem = this._denyItem.bind(this);
    this._postPosition = 0;
    this._itemList = null;
  }

  setup() {
    this._loginForm = document.querySelector("#loginForm");
    this._loginForm.addEventListener("submit", this._onLogin);
    this._loginForm.listUsers.addEventListener("click", this._onListUsers);
    this._postForm = document.querySelector("#postForm");
    this._postForm.addEventListener("submit", this._onPost);
  }

  _displayPost(post) {
    console.log(post);
    if (!(post instanceof Post)) throw new Error("displayPost wasn't passed a Post object");
    let elem = document.querySelector("#templatePost").cloneNode(true);
    console.log(elem.querySelector("#acceptButton"));
    elem.id = "";
    let avatar = elem.querySelector(".avatar");
    avatar.src = post.user.avatarURL;
    avatar.alt = `${post.user.name}'s avatar`;
    elem.querySelector(".name").textContent = post.user.name;
    elem.querySelector(".userid").textContent = post.user.id;
    elem.querySelector(".time").textContent = post.time.toLocaleString();
    elem.querySelector(".text").textContent = post.text;
    elem.querySelector(".price").textContent = post.price;
    elem.querySelector(".image").src = post.image;
    elem.querySelector("#acceptButton").addEventListener("click", () => {this._acceptItem(post._id)});
    elem.querySelector("#denyButton").addEventListener("click", this._denyItem);
    document.querySelector("#feed").append(elem);
  }

  async _loadProfile() {
    document.querySelector("#welcome").classList.add("hidden");
    document.querySelector("#main").classList.remove("hidden");
    document.querySelector("#idContainer").textContent = this._user.id;
    document.querySelector("#feed").textContent = "";
    this._postForm.querySelector(".avatar").src = this._user.avatarURL;
    this._postForm.querySelector(".name").textContent = this._user.name;
    this._postForm.querySelector(".userid").textContent = this._user.id;
    console.log(this._user);
    this._user = await User.loadOrCreate(this._user.id);
    let feed = await this._user.getFeed();
    console.log(feed);
    //for (let post of feed) {
    //for (let i = 0; i < feed.length; i++) {
    if (feed.length > 0) {
      if (this._postPosition < feed.length ) {
        this._displayPost(feed[this._postPosition]);
      } else {
        this._postPosition = 0;
        this._displayPost(feed[this._postPosition]);
      }
    }
    //}

    const onAdd = async (userId) => {
      await this._user.addFollow(userId);
      this._loadProfile();
    }
    const onDelete = async (userId) => {
      await this._user.deleteFollow(userId);
      this._loadProfile();
    }
    const onDeleteItem = async (_id) => {
      await this._user.deleteItem(_id);
      this._loadProfile();
    }    
    this._followerList.setList(this._user.following);
    this._itemList.setList(this._user.acceptedItems);
    console.log(this._user);
    this._followerList.addToDOM(
      document.querySelector("#followContainer"), 
      onAdd,
      onDelete
    );
    this._itemList.addToDOM(
      document.querySelector("#itemContainer"),
      onDeleteItem
    )
    document.querySelector("#nameContainer").textContent = "";
    document.querySelector("#avatarContainer").textContent = "";
    this._displayName.addToDOM(document.querySelector("#nameContainer"), this._onNameChange);
    this._displayName.setValue(this._user.name);
    this._avatarURL.addToDOM(document.querySelector("#avatarContainer"), this._onAvatarChange);
    this._avatarURL.setValue(this._user.avatarURL);
    //this._email.addToDOM(document.querySelector("#email"), this._onEmailChange);
  }

  /*** Event Handlers ***/

  async _onListUsers() {
    let users = await User.listUserPosts(this._user.id);
    console.log(users);
    let usersStr = users.join("\n\n");
    alert(`My Item Posts:\n\n${usersStr}`);
  }

  async _onLogin(event) {
    event.preventDefault();
    var id = document.getElementsByName("userid")[0].value;
    console.log(id);
    this._user = await User.loadOrCreate(id);
    console.log(this._user);
    document.querySelector("#followContainer").textContent = "";
    this._followerList = await new DynamicList("addUser", "Find Someone");
    this._itemList = await new ItemsList();
    this._loadProfile();
  }
  
  async _onPost(event) {
    event.preventDefault();
    let text = document.querySelector("#newPost").value;
    let price = document.querySelector("#price").value;
    let image = document.querySelector("#image").value;
    await this._user.makePost(text, price, image);
    await this._loadProfile();
  }

  async _onNameChange(element) {
    this._user.name = element.value;
    console.log(this._user);
    this._user.save();
    this._loadProfile();
  }

  async _onAvatarChange(element) {
    this._user.avatarURL = element.value;
    console.log(this._user);
    this._user.save();
    this._loadProfile();
  }

  // async _onEmailChange(element) {
  //   this._user.name = element.value;
  //   console.log(this._user);
  //   this._user.save();
  //   this._loadProfile();
  // }

  async _acceptItem(postId) {
    console.log("accepted");
    console.log(postId);
    await this._user.addItem(postId);
    this._loadProfile();
  }

  async _denyItem() {
    this._postPosition++;
    this._loadProfile();
  }
}

let app = new App();
app.setup();
