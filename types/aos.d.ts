declare module 'aos' {
       const AOS: {
         init: (options?: {
           duration?: number;
           easing?: string;
           once?: boolean;
           [key: string]: any;
         }) => void;
         refresh: () => void;
       };
       export default AOS;
     }
     