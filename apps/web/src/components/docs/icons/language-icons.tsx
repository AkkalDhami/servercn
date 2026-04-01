import { FileIcon } from "lucide-react";
import { FaGitAlt, FaStar } from "react-icons/fa";
import { TbBrandTypescript } from "react-icons/tb";

type IconProps = React.HTMLAttributes<SVGElement>;

export type PackageManagerType = "npm" | "yarn" | "pnpm" | "bun";

export const LanguageIcons = {
  npm: (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 128 128">
      <path
        fill="#cb3837"
        d="M0 7.062C0 3.225 3.225 0 7.062 0h113.88c3.838 0 7.063 3.225 7.063 7.062v113.88c0 3.838-3.225 7.063-7.063 7.063H7.062c-3.837 0-7.062-3.225-7.062-7.063zm23.69 97.518h40.395l.05-58.532h19.494l-.05 58.581h19.543l.05-78.075l-78.075-.1l-.1 78.126z"
      />
      <path
        fill="#fff"
        d="M25.105 65.52V26.512H40.96c8.72 0 26.274.034 39.008.075l23.153.075v77.866H83.645v-58.54H64.057v58.54H25.105z"
      />
    </svg>
  ),
  yarn: (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 256 256">
      <path
        fill="#368FB9"
        d="M128 0C57.328 0 0 57.328 0 128s57.328 128 128 128s128-57.328 128-128S198.672 0 128 0"
      />
      <path
        fill="#FFF"
        d="M203.317 174.06c-7.907 1.878-11.91 3.608-21.695 9.983c-15.271 9.884-31.976 14.48-31.976 14.48s-1.383 2.076-5.387 3.015c-6.918 1.68-32.963 3.114-35.335 3.163c-6.376.05-10.28-1.63-11.367-4.25c-3.311-7.907 4.744-11.367 4.744-11.367s-1.779-1.087-2.817-2.076c-.939-.939-1.927-2.816-2.224-2.125c-1.235 3.015-1.878 10.379-5.189 13.69c-4.547 4.596-13.146 3.064-18.236.395c-5.585-2.965.395-9.933.395-9.933s-3.015 1.779-5.436-1.878c-2.175-3.36-4.2-9.094-3.657-16.16c.593-8.056 9.587-15.865 9.587-15.865s-1.581-11.91 3.608-24.117c4.695-11.12 17.347-20.065 17.347-20.065s-10.626-11.762-6.672-22.338c2.57-6.92 3.608-6.87 4.448-7.166c2.965-1.137 5.831-2.373 7.957-4.695c10.625-11.466 24.166-9.292 24.166-9.292s6.425-19.52 12.356-15.715c1.828 1.186 8.401 15.814 8.401 15.814s7.018-4.102 7.809-2.57c4.25 8.254 4.744 24.019 2.866 33.607c-3.163 15.814-11.07 24.315-14.233 29.652c-.741 1.236 8.5 5.14 14.332 21.3c5.387 14.777.593 27.182 1.433 28.566c.148.247.198.346.198.346s6.177.494 18.582-7.166c6.622-4.102 14.48-8.698 23.425-8.797c8.65-.149 9.094 9.983 2.57 11.564m11.763-7.265c-.89-7.017-6.82-11.86-14.431-11.762c-11.367.148-20.905 6.03-27.231 9.934c-2.471 1.532-4.596 2.669-6.425 3.509c.395-5.733.05-13.245-2.916-21.498c-3.608-9.885-8.45-15.963-11.91-19.472c4.003-5.832 9.489-14.332 12.058-27.478c2.224-11.219 1.533-28.664-3.558-38.45c-1.038-1.976-2.767-3.41-4.942-4.003c-.89-.247-2.57-.741-5.881.198c-4.991-10.329-6.721-11.416-8.056-12.306c-2.767-1.779-6.029-2.174-9.093-1.038c-4.102 1.483-7.61 5.437-10.922 12.454a52 52 0 0 0-1.334 3.015c-6.277.445-16.161 2.718-24.513 11.762c-1.038 1.137-3.064 1.977-5.19 2.768h.05c-4.349 1.532-6.326 5.09-8.747 11.515c-3.361 8.994.098 17.84 3.508 23.574c-4.645 4.151-10.823 10.773-14.084 18.532c-4.053 9.588-4.498 18.978-4.35 24.068c-3.459 3.658-8.796 10.527-9.39 18.237c-.79 10.773 3.114 18.088 4.844 20.756c.494.791 1.038 1.434 1.63 2.076c-.197 1.334-.246 2.768.05 4.25c.643 3.46 2.817 6.277 6.128 8.056c6.524 3.46 15.617 4.942 22.635 1.433c2.52 2.669 7.117 5.239 15.469 5.239h.494c2.125 0 29.109-1.433 36.967-3.36c3.509-.841 5.93-2.324 7.512-3.658c5.04-1.582 18.977-6.326 32.123-14.826c9.291-6.03 12.504-7.315 19.423-8.995c6.72-1.63 10.922-7.759 10.082-14.53"
      />
    </svg>
  ),
  pnpm: (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 32 32">
      <path
        fill="#f9ad00"
        d="M30 10.75h-8.749V2H30Zm-9.626 0h-8.75V2h8.75Zm-9.625 0H2V2h8.749ZM30 20.375h-8.749v-8.75H30Z"
      />
      <path
        fill="#4e4e4e"
        d="M20.374 20.375h-8.75v-8.75h8.75Zm0 9.625h-8.75v-8.75h8.75ZM30 30h-8.749v-8.75H30Zm-19.251 0H2v-8.75h8.749Z"
      />
    </svg>
  ),
  bun: (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 32 32">
      <path
        fill="#fff8e1"
        d="M30 17.045a9.8 9.8 0 0 0-.32-2.306l-.004.034a11.2 11.2 0 0 0-5.762-6.786c-3.495-1.89-5.243-3.326-6.8-3.811h.003c-1.95-.695-3.949.82-5.825 1.927c-4.52 2.481-9.573 5.45-9.28 11.417c.008-.029.017-.052.026-.08a9.97 9.97 0 0 0 3.934 7.257l-.01-.006C13.747 31.473 30.05 27.292 30 17.045"
      />
      <path
        fill="#37474f"
        d="M19.855 20.236A.8.8 0 0 0 19.26 20h-6.514a.8.8 0 0 0-.596.236a.51.51 0 0 0-.137.463a4.37 4.37 0 0 0 1.641 2.339a4.2 4.2 0 0 0 2.349.926a4.2 4.2 0 0 0 2.343-.926a4.37 4.37 0 0 0 1.642-2.339a.5.5 0 0 0-.132-.463Z"
      />
      <ellipse cx="22.5" cy="18.5" fill="#f8bbd0" rx="2.5" ry="1.5" />
      <ellipse cx="9.5" cy="18.5" fill="#f8bbd0" rx="2.5" ry="1.5" />
      <circle cx="10" cy="16" r="2" fill="#37474f" />
      <circle cx="22" cy="16" r="2" fill="#37474f" />
      <path
        fill="#455a64"
        d="M9.996 18A2 2 0 1 0 8 15.996V16a2 2 0 0 0 1.996 2"
      />
      <circle cx="9" cy="15" r="1" fill="#fafafa" />
      <circle cx="21" cy="15" r="1" fill="#fafafa" />
    </svg>
  ),
  spinner: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  json: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffca28"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-braces"
      {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M7 4a2 2 0 0 0 -2 2v3a2 3 0 0 1 -2 3a2 3 0 0 1 2 3v3a2 2 0 0 0 2 2" />
      <path d="M17 4a2 2 0 0 1 2 2v3a2 3 0 0 0 2 3a2 3 0 0 0 -2 3v3a2 2 0 0 1 -2 2" />
    </svg>
  ),

  html: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 48 48"
      {...props}>
      <path fill="#E65100" d="M41,5H7l3,34l14,4l14-4L41,5L41,5z"></path>
      <path fill="#FF6D00" d="M24 8L24 39.9 35.2 36.7 37.7 8z"></path>
      <path
        fill="#FFF"
        d="M24,25v-4h8.6l-0.7,11.5L24,35.1v-4.2l4.1-1.4l0.3-4.5H24z M32.9,17l0.3-4H24v4H32.9z"></path>
      <path
        fill="#EEE"
        d="M24,30.9v4.2l-7.9-2.6L15.7,27h4l0.2,2.5L24,30.9z M19.1,17H24v-4h-9.1l0.7,12H24v-4h-4.6L19.1,17z"></path>
    </svg>
  ),

  js: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 48 48"
      {...props}>
      <path fill="#ffd600" d="M6,42V6h36v36H6z"></path>
      <path
        fill="#000001"
        d="M29.538 32.947c.692 1.124 1.444 2.201 3.037 2.201 1.338 0 2.04-.665 2.04-1.585 0-1.101-.726-1.492-2.198-2.133l-.807-.344c-2.329-.988-3.878-2.226-3.878-4.841 0-2.41 1.845-4.244 4.728-4.244 2.053 0 3.528.711 4.592 2.573l-2.514 1.607c-.553-.988-1.151-1.377-2.078-1.377-.946 0-1.545.597-1.545 1.377 0 .964.6 1.354 1.985 1.951l.807.344C36.452 29.645 38 30.839 38 33.523 38 36.415 35.716 38 32.65 38c-2.999 0-4.702-1.505-5.65-3.368L29.538 32.947zM17.952 33.029c.506.906 1.275 1.603 2.381 1.603 1.058 0 1.667-.418 1.667-2.043V22h3.333v11.101c0 3.367-1.953 4.899-4.805 4.899-2.577 0-4.437-1.746-5.195-3.368L17.952 33.029z"></path>
    </svg>
  ),

  tsconfig: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 32 32"
      {...props}>
      <path
        fill="#007acc"
        d="M23.827 8.243a4.4 4.4 0 0 1 2.223 1.281a6 6 0 0 1 .852 1.143c.011.045-1.534 1.083-2.471 1.662c-.034.023-.169-.124-.322-.35a2.01 2.01 0 0 0-1.67-1c-1.077-.074-1.771.49-1.766 1.433a1.3 1.3 0 0 0 .153.666c.237.49.677.784 2.059 1.383c2.544 1.095 3.636 1.817 4.31 2.843a5.16 5.16 0 0 1 .416 4.333a4.76 4.76 0 0 1-3.932 2.815a11 11 0 0 1-2.708-.028a6.53 6.53 0 0 1-3.616-1.884a6.3 6.3 0 0 1-.926-1.371a3 3 0 0 1 .327-.208c.158-.09.756-.434 1.32-.761l1.024-.6l.214.312a4.8 4.8 0 0 0 1.35 1.292a3.3 3.3 0 0 0 3.458-.175a1.545 1.545 0 0 0 .2-1.974c-.276-.395-.84-.727-2.443-1.422a8.8 8.8 0 0 1-3.349-2.055a4.7 4.7 0 0 1-.976-1.777a7.1 7.1 0 0 1-.062-2.268a4.33 4.33 0 0 1 3.644-3.374a9 9 0 0 1 2.691.084m-8.343 1.483l.011 1.454h-4.63v13.148H7.6V11.183H2.97V9.755a14 14 0 0 1 .04-1.466c.017-.023 2.832-.034 6.245-.028l6.211.017Z"
      />
    </svg>
  ),

  ts: (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 256 256">
      <path
        fill="#3178C6"
        d="M20 0h216c11.046 0 20 8.954 20 20v216c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20V20C0 8.954 8.954 0 20 0"
      />
      <path
        fill="#FFF"
        d="M150.518 200.475v27.62q6.738 3.453 15.938 5.179T185.849 235q9.934 0 18.874-1.899t15.678-6.257q6.738-4.359 10.669-11.394q3.93-7.033 3.93-17.391q0-7.51-2.246-13.163a30.8 30.8 0 0 0-6.479-10.055q-4.232-4.402-10.149-7.898t-13.347-6.602q-5.442-2.245-9.761-4.359t-7.342-4.316q-3.024-2.2-4.665-4.661t-1.641-5.567q0-2.848 1.468-5.135q1.469-2.288 4.147-3.927t6.565-2.547q3.887-.906 8.638-.906q3.456 0 7.299.518q3.844.517 7.732 1.597a54 54 0 0 1 7.558 2.719a41.7 41.7 0 0 1 6.781 3.797v-25.807q-6.306-2.417-13.778-3.582T198.633 107q-9.847 0-18.658 2.115q-8.811 2.114-15.506 6.602q-6.694 4.49-10.582 11.437Q150 134.102 150 143.769q0 12.342 7.127 21.06t21.638 14.759a292 292 0 0 1 10.625 4.575q4.924 2.244 8.509 4.66t5.658 5.265t2.073 6.474a9.9 9.9 0 0 1-1.296 4.963q-1.295 2.287-3.93 3.97t-6.565 2.632t-9.2.95q-8.983 0-17.794-3.151t-16.327-9.451m-46.036-68.733H140V109H41v22.742h35.345V233h28.137z"
      />
    </svg>
  ),
  tsx: (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 32 32">
      <path
        fill="#0288d1"
        d="M16 12c7.444 0 12 2.59 12 4s-4.556 4-12 4s-12-2.59-12-4s4.556-4 12-4m0-2c-7.732 0-14 2.686-14 6s6.268 6 14 6s14-2.686 14-6s-6.268-6-14-6"
      />
      <path fill="#0288d1" d="M16 14a2 2 0 1 0 2 2a2 2 0 0 0-2-2" />
      <path
        fill="#0288d1"
        d="M10.458 5.507c2.017 0 5.937 3.177 9.006 8.493c3.722 6.447 3.757 11.687 2.536 12.392a.9.9 0 0 1-.457.1c-2.017 0-5.938-3.176-9.007-8.492C8.814 11.553 8.779 6.313 10 5.608a.9.9 0 0 1 .458-.1m-.001-2A2.87 2.87 0 0 0 9 3.875C6.13 5.532 6.938 12.304 10.804 19c3.284 5.69 7.72 9.493 10.74 9.493A2.87 2.87 0 0 0 23 28.124c2.87-1.656 2.062-8.428-1.804-15.124c-3.284-5.69-7.72-9.493-10.74-9.493Z"
      />
      <path
        fill="#0288d1"
        d="M21.543 5.507a.9.9 0 0 1 .457.1c1.221.706 1.186 5.946-2.536 12.393c-3.07 5.316-6.99 8.493-9.007 8.493a.9.9 0 0 1-.457-.1C8.779 25.686 8.814 20.446 12.536 14c3.07-5.316 6.99-8.493 9.007-8.493m0-2c-3.02 0-7.455 3.804-10.74 9.493C6.939 19.696 6.13 26.468 9 28.124a2.87 2.87 0 0 0 1.457.369c3.02 0 7.455-3.804 10.74-9.493C25.061 12.304 25.87 5.532 23 3.876a2.87 2.87 0 0 0-1.457-.369"
      />
    </svg>
  ),

  bash: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#16da8f"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-terminal"
      {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 7l5 5l-5 5" />
      <path d="M12 19l7 0" />
    </svg>
  ),
  prisma: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 48 48"
      {...props}>
      <path
        fill="#4db6ac"
        d="M44.284,36.035L27.687,1.429c-0.855-1.783-3.337-1.93-4.397-0.26L4.886,30.177	c-0.397,0.625-0.385,1.426,0.029,2.04l9.271,13.738c0.575,0.852,1.634,1.237,2.623,0.953l25.942-7.458	C44.208,39.031,44.939,37.402,44.284,36.035z M40.618,37.279L18.8,43.388c-0.505,0.142-0.98-0.305-0.87-0.818l7.735-36.097	c0.139-0.65,1.023-0.755,1.311-0.157l14.265,29.621C41.489,36.481,41.194,37.118,40.618,37.279z"></path>
    </svg>
  ),
  mdx: (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 32 32">
      <path
        fill="#ffca28"
        d="m14 10l-4 3.5L6 10H4v12h4v-6l2 2l2-2v6h4V10zm12 6v-6h-4v6h-4l6 8l6-8z"
      />
    </svg>
  ),
  sql: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#ffca28"
      className="icon icon-tabler icons-tabler-filled icon-tabler-database"
      {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 15.731c1.968 1.507 5.234 2.269 9 2.269c3.76 0 7.025 -.76 9 -2.252v2.252c0 2.425 -3.895 3.936 -8.693 3.998l-.307 .002c-4.938 0 -9 -1.523 -9 -4z" />
      <path d="M3 9.731c1.968 1.507 5.234 2.269 9 2.269c3.76 0 7.025 -.76 9 -2.252v2.252c0 2.477 -4.062 4 -9 4c-4.798 0 -8.77 -1.438 -8.979 -3.795l-.016 -.101l-.005 -.104z" />
      <path d="M12 2c1.041 0 2.044 .068 2.977 .198l.469 .071q .84 .14 1.586 .348l.44 .131l.075 .024a11 11 0 0 1 .805 .3l.199 .086q .535 .242 .967 .53q .165 .11 .313 .225a3.8 3.8 0 0 1 .669 .668l.091 .128q .07 .105 .129 .211l.07 .139q .163 .35 .2 .73l.01 .211c0 2.477 -4.062 4 -9 4c-4.798 0 -8.77 -1.438 -8.979 -3.795a1 1 0 0 1 -.021 -.205l.005 -.104l.016 -.1c.205 -2.306 4.01 -3.733 8.667 -3.794z" />
    </svg>
  ),
  nodejs: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1fc72a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-brand-nodejs"
      {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 9v8.044a2 2 0 0 1 -2.996 1.734l-1.568 -.9a3 3 0 0 1 -1.436 -2.561v-6.635a3 3 0 0 1 1.436 -2.56l6 -3.667a3 3 0 0 1 3.128 0l6 3.667a3 3 0 0 1 1.436 2.561v6.634a3 3 0 0 1 -1.436 2.56l-6 3.667a3 3 0 0 1 -3.128 0" />
      <path d="M17 9h-3.5a1.5 1.5 0 0 0 0 3h2a1.5 1.5 0 0 1 0 3h-3.5" />
    </svg>
  ),
  env: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--muted-foreground)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-settings-cancel"
      {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12.29 20.977c-.818 .132 -1.724 -.3 -1.965 -1.294a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c.983 .238 1.416 1.126 1.298 1.937" />
      <path d="M16 19a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M17 21l4 -4" />
      <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    </svg>
  ),
  postcss: (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 32 32">
      <path fill="#e53935" d="M20 12v8h-8v-8zm2-2H10v12h12z" />
      <path fill="#e53935" d="M16 5.488L26.159 20H5.84zM16 2L2 22h28z" />
      <path
        fill="#e53935"
        d="M16 13a3 3 0 1 1-3 3a3.003 3.003 0 0 1 3-3m0-2a5 5 0 1 0 5 5a5 5 0 0 0-5-5"
      />
      <path
        fill="#e53935"
        d="M16 4A12 12 0 1 1 4 16A12.014 12.014 0 0 1 16 4m0-2a14 14 0 1 0 14 14A14 14 0 0 0 16 2"
      />
    </svg>
  ),
  css: (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 128 128">
      <path
        fill="#639"
        d="M0 0h107.52C118.831 0 128 9.168 128 20.48v87.04c0 11.312-9.168 20.48-20.48 20.48H20.48C9.169 128 0 118.832 0 107.52Z"
      />
      <path
        fill="#fff"
        d="M45.836 117.762c-8.219-.008-13.293-4.64-13.195-13.16V83.05q0-6.481 3.793-9.852c4.543-4.379 15.082-4.644 19.53.067c2.743 2.417 3.778 7.355 3.532 11.964H50.06c.074-1.808-.024-4.554-1.09-5.586c-1.383-1.87-5.035-1.652-6.004.297c-.594 1.059-.89 2.621-.89 4.696v18.71q0 5.884 4.09 5.95q1.914-.001 2.905-1.39c.918-1.099 1.063-3.528.989-5.29h9.437c.645 8.969-4.652 15.254-13.66 15.144Zm29.957 0c-9.11.125-13.184-6.36-12.934-15.145h8.91c-.25 3.832 1.067 7.32 4.223 7.078q2.11 0 2.969-1.324c1.086-1.613 1.293-6.265-.266-8.066c-1.085-1.735-4.996-3.266-7.058-4.297q-4.423-2.115-6.367-5.027c-2.93-4.305-2.657-13.754 1.449-17.586c3.992-4.727 14.414-4.942 18.41-.098c2.465 2.496 3.54 7.41 3.332 11.934h-8.578c.074-1.86-.102-4.86-.824-5.95q-.762-1.39-2.871-1.39q-3.762.001-3.762 4.496c.027 3.18 1.27 4.488 4.16 5.816c3.742 1.453 8.5 3.938 10.227 6.942c5.144 9.16 1.613 23.148-11.02 22.613Zm28.77 0c-9.11.125-13.184-6.36-12.934-15.145h8.91c-.25 3.832 1.066 7.32 4.223 7.078q2.108 0 2.969-1.324c1.085-1.613 1.289-6.265-.266-8.066c-1.086-1.735-4.996-3.266-7.059-4.297q-4.423-2.115-6.367-5.027c-2.93-4.305-2.656-13.754 1.45-17.586c3.992-4.727 14.413-4.942 18.41-.098c2.464 2.496 3.539 7.41 3.332 11.934h-8.579c.07-1.86-.101-4.86-.824-5.95q-.762-1.39-2.87-1.39q-3.763.001-3.763 4.496c.028 3.18 1.27 4.488 4.16 5.816c3.743 1.453 8.5 3.938 10.227 6.942c5.145 9.16 1.614 23.148-11.02 22.613Z"
      />
    </svg>
  ),
  nextjs: (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="m11.345 2.405l-.303.027c-2.84.256-5.501 1.789-7.187 4.144a9.9 9.9 0 0 0-1.765 4.37c-.08.548-.09.71-.09 1.455s.01.907.09 1.457c.543 3.755 3.216 6.91 6.84 8.079c.65.209 1.334.351 2.112.438c.303.033 1.613.033 1.916 0c1.343-.15 2.48-.481 3.603-1.054c.172-.088.205-.112.182-.131c-.016-.012-.749-.995-1.629-2.184l-1.599-2.16l-2.004-2.965a287 287 0 0 0-2.017-2.963c-.008-.002-.016 1.315-.02 2.924c-.006 2.817-.008 2.93-.043 2.997a.36.36 0 0 1-.172.178c-.063.03-.117.037-.412.037h-.339l-.09-.057a.4.4 0 0 1-.13-.143l-.042-.088l.004-3.919l.006-3.921l.06-.076a.5.5 0 0 1 .145-.12c.08-.039.112-.043.45-.043c.399 0 .465.016.569.13c.03.03 1.114 1.665 2.412 3.633l3.946 5.976l1.583 2.398l.08-.052c.71-.462 1.46-1.118 2.055-1.803a9.95 9.95 0 0 0 2.354-5.111c.08-.55.09-.712.09-1.457c0-.744-.01-.907-.09-1.456c-.543-3.755-3.216-6.91-6.84-8.079a10.5 10.5 0 0 0-2.083-.436c-.187-.02-1.48-.04-1.642-.025m4.094 6.048c.094.047.17.137.197.23c.016.051.02 1.138.016 3.587l-.006 3.515l-.62-.95l-.621-.95V11.33c0-1.652.008-2.58.02-2.625a.4.4 0 0 1 .193-.246c.08-.041.11-.045.416-.045c.29 0 .34.004.405.039"
      />
    </svg>
  ),
  eslint: (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 128 128">
      <path
        fill="#8080f2"
        d="m38.662 48.67l24.26-14.04a2.19 2.19 0 0 1 1.962 0l24.363 14.04c.62.31 1.033 1.032 1.033 1.651v28.08c0 .723-.413 1.342-1.033 1.755l-24.26 14.04a2.19 2.19 0 0 1-1.962 0l-24.363-14.04c-.62-.31-1.033-1.032-1.033-1.755v-28.08c0-.62.413-1.342 1.033-1.651"
      />
      <path
        fill="#4b32c3"
        d="m127.135 61.47l-29.01-50.585c-1.032-1.858-2.993-3.2-5.161-3.2H34.945c-2.064 0-4.026 1.342-5.161 3.2L.774 61.368a6.18 6.18 0 0 0 0 5.987l29.01 50.173c1.032 1.858 2.993 2.787 5.161 2.787h58.122c2.065 0 4.026-.929 5.162-2.684l29.01-50.173c1.032-2.064 1.032-4.232-.104-5.987M103.08 85.73c0 .723-.413 1.445-1.136 1.755l-36.958 21.37a1.88 1.88 0 0 1-2.065 0l-37.06-21.266c-.62-.413-1.136-1.032-1.136-1.755V42.991c0-.722.413-1.445 1.136-1.754l37.061-21.37a1.88 1.88 0 0 1 2.065 0l37.062 21.37c.619.412 1.135 1.032 1.135 1.754v42.74z"
      />
    </svg>
  ),
  svg: (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 30 30">
      <path
        fill="#ffb300"
        d="M29.168 14.03a2.7 2.7 0 0 0-1.968-.83a2.51 2.51 0 0 0-1.929.8h-4.443l3.078-3.078a2.835 2.835 0 0 0 2.857-2.842a2.6 2.6 0 0 0-.831-1.969a2.82 2.82 0 0 0-2.014-.788a2.67 2.67 0 0 0-1.968.788a2.36 2.36 0 0 0-.812 1.922L18 11.17V6.726a2.51 2.51 0 0 0 .8-1.929a2.7 2.7 0 0 0-.832-1.968a2.745 2.745 0 0 0-3.936 0a2.7 2.7 0 0 0-.832 1.968a2.51 2.51 0 0 0 .8 1.93v4.443l-3.138-3.138a2.36 2.36 0 0 0-.812-1.922a2.66 2.66 0 0 0-1.968-.788a2.83 2.83 0 0 0-2.014.788a2.6 2.6 0 0 0-.831 1.969a2.74 2.74 0 0 0 .831 2.013a2.8 2.8 0 0 0 2.026.829l3.078 3.078H6.729a2.51 2.51 0 0 0-1.929-.8a2.7 2.7 0 0 0-1.968.831a2.745 2.745 0 0 0 0 3.937a2.7 2.7 0 0 0 1.968.832a2.51 2.51 0 0 0 1.929-.8h4.443l-3.078 3.077a2.835 2.835 0 0 0-2.857 2.842a2.6 2.6 0 0 0 .831 1.969a2.82 2.82 0 0 0 2.014.788a2.67 2.67 0 0 0 1.968-.788a2.36 2.36 0 0 0 .812-1.922L14 20.827v4.444a2.51 2.51 0 0 0-.8 1.929a2.784 2.784 0 0 0 4.768 1.968A2.7 2.7 0 0 0 18.8 27.2a2.51 2.51 0 0 0-.8-1.929v-4.444l3.138 3.138a2.36 2.36 0 0 0 .812 1.922a2.66 2.66 0 0 0 1.968.788a2.83 2.83 0 0 0 2.014-.788a2.6 2.6 0 0 0 .831-1.969a2.74 2.74 0 0 0-.831-2.013a2.8 2.8 0 0 0-2.026-.829L20.828 18h4.443a2.51 2.51 0 0 0 1.93.8a2.784 2.784 0 0 0 1.967-4.769Z"
      />
    </svg>
  ),
  commitlint: (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24">
      <path
        fill="#009688"
        d="M2.47 2.922V8.37h1.813V2.922zm12.708 1.816a7.27 7.27 0 0 0-6.946 5.127L6.1 12l2.133 2.133c.916 2.969 3.677 5.13 6.945 5.13c4.013 0 7.262-3.25 7.262-7.263s-3.25-7.262-7.262-7.262m2.942 3.703l1.342 1.63l-5.49 5.488l-3.179-3.467l1.34-1.34l1.838 1.838zM3.377 10.184c-.998 0-1.816.817-1.816 1.816a1.817 1.817 0 1 0 1.816-1.816M2.47 15.63v5.448h1.814V15.63z"
      />
    </svg>
  ),
  prettier: (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 16 16">
      <path fill="#f44336" d="M2 8h4v1H2zm0 6h4v1H2zm9-10h3v1h-3zM2 2h3v1H2z" />
      <path
        fill="#f9a825"
        d="M9 2h3v1H9zm1 4h4v1h-4zm-5 6h1v1H5zm-3-2h6v1H2z"
      />
      <path fill="#26a69a" d="M2 12h3v1H2zm7-4h5v1H9zM2 4h4v1H2zm3-2h4v1H5z" />
      <path fill="#ba68c8" d="M2 6h3v1H2zm7-2h2v1H9zm-1 6h4v1H8z" />
    </svg>
  ),
  shadcn: (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m18 12l-6 6m6-14L4 18"
      />
    </svg>
  )
};

export function getIconForLanguageExtension(
  language: string,
  fileName?: string
) {
  if (["package.json", ".nvmrc"].includes(fileName || "")) {
    return <LanguageIcons.nodejs className="size-4" />;
  }
  if (fileName === "tsconfig.json") {
    return <LanguageIcons.tsconfig className="size-4" />;
  }
  if (fileName === "components.json") {
    return <LanguageIcons.shadcn className="size-4" />;
  }
  if (fileName === "postcss.config.mjs") {
    return <LanguageIcons.postcss className="size-4" />;
  }
  if (fileName?.startsWith(".env")) {
    return <LanguageIcons.env className="size-4" />;
  }
  if (
    [
      ".commitlintrc",
      ".commitlintrc.json",
      "commitlint.config.ts",
      "commitlint.config.mjs",
      "commitlint.config.cjs",
      "commitlint.config.js",
      ".commitlintrc.ts",
      ".commitlintrc.mjs",
      ".commitlintrc.cjs"
    ].includes(fileName || "")
  ) {
    return <LanguageIcons.commitlint className="size-4" />;
  }
  if (
    [
      ".eslintrc.json",
      ".eslintignore",
      ".eslintrc.json",
      "eslint.config.js",
      "eslint.config.mjs",
      "eslint.config.cjs",
      "eslint.config.ts"
    ].includes(fileName || "")
  ) {
    return <LanguageIcons.eslint className="size-4" />;
  }
  if (fileName?.startsWith("next.config")) {
    return <LanguageIcons.nextjs className="size-4" />;
  }
  if (fileName?.startsWith("favicon.ico")) {
    return <FaStar className="size-4 text-yellow-600" />;
  }
  if (
    [
      ".prettierrc.json",
      ".prettierrc",
      ".prettierignore",
      "prettier.config.js",
      "prettier.config.ts",
      ".prettierrc.js",
      ".prettierrc.ts",
      ".prettierrc.cjs",
      ".prettierrc.cts",
      "prettier.config.mjs",
      "prettier.config.cjs",
      "prettier.config.cts"
    ].includes(fileName || "")
  ) {
    return <LanguageIcons.prettier className="size-4" />;
  }
  if (fileName?.endsWith(".css")) {
    return <LanguageIcons.css className="size-4" />;
  }
  if (fileName?.endsWith(".svg")) {
    return <LanguageIcons.svg className="size-4" />;
  }
  if (fileName?.endsWith(".prisma")) {
    return <LanguageIcons.prisma className="size-4" />;
  }
  if (fileName?.endsWith(".d.ts")) {
    return <TbBrandTypescript className="size-4 text-[#3178c6]" />;
  }
  if (fileName?.endsWith(".sql")) {
    return <LanguageIcons.sql className="size-4" />;
  }
  if (fileName?.endsWith(".tsx")) {
    return <LanguageIcons.tsx className="size-4" />;
  }
  if (fileName?.endsWith(".jsx")) {
    return <LanguageIcons.tsx className="size-4" />;
  }
  if (fileName?.endsWith(".gitignore")) {
    return <FaGitAlt className="size-4 text-[#e64a19]" />;
  }
  if (fileName?.endsWith(".ejs") || fileName?.endsWith(".html")) {
    return <LanguageIcons.html className="size-4" />;
  }
  if (fileName?.endsWith(".mdx") || fileName?.endsWith(".md")) {
    return <LanguageIcons.mdx className="size-4" />;
  }
  switch (language) {
    case "json":
      return <LanguageIcons.json className="size-4" />;
    case "javascript":
    case "js":
      return <LanguageIcons.js className="size-4" />;
    case "ts":
    case "typescript":
      return <LanguageIcons.ts className="fill-foreground size-4" />;
    case "bash":
      return <LanguageIcons.bash className="size-4" />;
    case "prisma":
      return <LanguageIcons.prisma className="size-4" />;
    case "sql":
      return <LanguageIcons.sql className="size-4" />;

    case "mdx":
    case "md":
    case "markdown":
      return <LanguageIcons.mdx className="size-4" />;
    default:
      return <FileIcon className="size-4" />;
  }
}

export function getPackageManagerIcon(packageManager: PackageManagerType) {
  switch (packageManager) {
    case "npm":
      return <LanguageIcons.npm />;
    case "yarn":
      return <LanguageIcons.yarn />;
    case "pnpm":
      return <LanguageIcons.pnpm />;
    case "bun":
      return <LanguageIcons.bun />;
    default:
      return <LanguageIcons.bash />;
  }
}
