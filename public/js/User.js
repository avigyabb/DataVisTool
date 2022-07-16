import apiRequest from "./api.js";

/* A small class to represent a Post */
export class Post {
  /* data is the post data from the API. */
  constructor(data) {
    this._id = data._id;
    this.user = new User(data.user);
    this.time = new Date(data.time);
    this.text = data.text;
    this.price = data.price;
    this.image = data.image;
  }
}

/* A data model representing a user of the app. */
export default class User {
  /* Returns an array of user IDs */
  static async listUserPosts(id) {
    console.log("ran");
    let data = await apiRequest("GET", "/users/" + id + "/posts");
    console.log(data);
    return data;
  }
  
  /* Returns a User object, creating the user if necessary. */
  static async loadOrCreate(id) {
    try {
      let data = await apiRequest("GET", "/users/" + id);
      return new User(data.user);
    } catch (error) {
      let body = JSON.stringify({"id":id});
      let data = await apiRequest("POST", "/users", body);
      return new User(data.user); 
    }
  }

  constructor(data) {
    Object.assign(this, data);
  }

  /* Returns an Object containing only the public instances variables (i.e. the ones sent to the API). */
  toJSON() {
    return JSON.stringify({
      "id":this.id,
      "name":this.name,
      "avatarURL":this.avatarURL,
    })
  }

  /* Save the current state (name and avatar URL) of the user to the server. */
  async save() {
    let body = this.toJSON();
    await apiRequest("PATCH", "/users/" + this.id, body);
  }

  /* Returns an Array of Post objects. Includes the user's own posts as well as those of users they are following. */
  async getFeed() {
    //TODO
    console.log("ran");
    console.log(this.id);
    console.log(await apiRequest("GET", "/users/" + this.id + "/feed"));
    let data = await apiRequest("GET", "/users/" + this.id + "/feed");
    console.log("ran after");
    console.log(data);
    let output = [];
    for (let postData of data) {
      output.push(new Post(postData))
    }
    return output;
  }

  /* Create a new post with hte given text. */
  async makePost(text, price, image) {
    let body = JSON.stringify({"text":text, "price":price, "image":image});
    await apiRequest("POST", "/users/" + this.id + "/posts", body);
  }

  /* Start following the specified user id. Throws an HTTPError if the specified user ID does not exist. */
  async addFollow(id) {
    try {
      await apiRequest("POST", "/users/" + this.id + "/follow?target=" + id); 
    } catch {
      alert("Error");
    }
  }

  /* Stop following the specified user id. Throws an HTTPError if the user isn't following them. */
  async deleteFollow(id) {
    try {
      await apiRequest("DELETE", "/users/" + this.id + "/follow?target=" + id); 
    } catch {
      alert("Error");
    }
  }

  async addItem(id) {
    try {
      console.log("Item Added");
      console.log(id);
      await apiRequest("POST", "/users/" + this.id + "/item?target=" + id);
    } catch {
      alert("Error");
    }
  }

  async deleteItem(id) {
    try {
      await apiRequest("DELETE", "/users/" + this.id + "/item?target=" + id);
    } catch {
      alert("Error");
    }
  }
}
