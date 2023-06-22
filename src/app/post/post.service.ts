import { Injectable } from "@angular/core";
import { Subject} from "rxjs";
import { map } from "rxjs/operators"
import { HttpClient } from '@angular/common/http'

import { Post } from "./post.model";

@Injectable({providedIn: 'root'})
export class PostsService {
   posts : Post[] = [];
  private postsUpdate = new Subject<Post[]>();
  prisma: any;


  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: any}>
    ('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map((post: { title: ''; content: ''; id: ''; }) => {
        return {
          title: post.title,
          content: post.content,
          id: post.id
        }
      })
    }))

    .subscribe((transformedData) => {
        this.posts = transformedData;
        this.postsUpdate.next([...this.posts]);
      });

  };

  getPostUpdateListener() {
    return this.postsUpdate.asObservable()
  };

   getPost(id: string) {
    return ({...this.posts.find(p => p.id === id)
    })
  }

  addPost( title: string, content: string) {
    const post: Post =  {
      title: title, content: content,
      id: ''
    };
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe(responseData => {
        const id = responseData.postId;
        post.id = id;
        console.log(responseData.message);
        this.posts.push(post);
        this.postsUpdate.next([...this.posts])
      });
  };

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdate.next([...this.posts])
    })
  }
};
