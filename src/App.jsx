import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Mail, MapPin, Phone, Send, Download, GraduationCap, Award, ExternalLink, ChevronDown, Star, FileText, X, Eye, Menu, ArrowRight, MessageSquare, BookOpen, Calendar, Clock, Search, Tag, Sparkles } from 'lucide-react';
import { StarBackground } from './components/Three3D';
const ProgrammerScene = lazy(() => import('./components/Three3D').then(m => ({ default: m.ProgrammerScene })));
const ProjectCanvas   = lazy(() => import('./components/Three3D').then(m => ({ default: m.ProjectCanvas })));
const SkillGlobe      = lazy(() => import('./components/SkillGlobe'));
import Preloader from './components/Preloader';
import AIChatBot from './components/AIChatBot';
import profilePhoto from './assets/profile_new.jpg';
import bedfordshireLogo from './assets/bedfordshire_logo.png';
import scuLogo from './assets/scu_logo.png';

const logos = {
  html5:    <svg viewBox="0 0 24 24"><path fill="#e34f26" d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157z"/></svg>,
  css3:     <svg viewBox="0 0 24 24"><path fill="#1572b6" d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53z"/></svg>,
  javascript:<svg viewBox="0 0 24 24"><path fill="#f7df1e" d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/></svg>,
  react:    <svg viewBox="0 0 24 24"><path fill="#61dafb" d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09c.347 0 .62.07.799.177 1.019.59 1.41 2.85.977 5.76a14.97 14.97 0 0 0-1.564-.254 15.197 15.197 0 0 0-.998-1.458c.588-.665 1.16-1.26 1.697-1.764-.308-.22-.659-.36-1.013-.45.536-.512 1.047-.937 1.507-1.266.142-.1.29-.185.433-.26a2.74 2.74 0 0 1 .163-.485zm-9.752 0c.13 0 .27.013.422.04.455.083.908.228 1.37.437-.48.337-.993.767-1.528 1.277a2.81 2.81 0 0 0-.804.394c.489.501 1.013 1.082 1.558 1.729a15.42 15.42 0 0 0-1.013 1.453 15.19 15.19 0 0 0-1.574.26c-.422-2.893-.026-5.14.972-5.726.18-.107.43-.164.597-.864zM12 8.1c.473 0 .953.047 1.432.137a14.93 14.93 0 0 1 .992 1.51c.368.57.702 1.143 1.003 1.717a14.93 14.93 0 0 1-1.003 1.716 14.93 14.93 0 0 1-.992 1.511A14.94 14.94 0 0 1 12 14.829a14.97 14.97 0 0 1-1.432-.138 14.99 14.99 0 0 1-.992-1.51A15.68 15.68 0 0 1 8.57 11.46a15.35 15.35 0 0 1 1.006-1.716 14.93 14.93 0 0 1 .992-1.51A14.97 14.97 0 0 1 12 8.1z"/></svg>,
  bootstrap:<svg viewBox="0 0 24 24"><path fill="#7952b3" d="M11.77 11.24H9.956V8.202h2.152c1.17 0 1.834.522 1.834 1.466 0 1.008-.773 1.572-2.174 1.572zm.324 1.206H9.956v3.348h2.231c1.459 0 2.232-.585 2.232-1.685s-.795-1.663-2.325-1.663zM24 11.39v1.218C24 18.787 18.788 24 12.609 24H11.39C5.213 24 0 18.787 0 12.608V11.39C0 5.213 5.213 0 11.39 0h1.218C18.788 0 24 5.213 24 11.39zm-7.438 3.11c0-1.104-.665-2.019-1.743-2.369v-.028c.94-.338 1.529-1.19 1.529-2.194 0-1.723-1.27-2.734-3.414-2.734H8.177v10.638h4.92c2.368 0 3.465-1.23 3.465-3.313z"/></svg>,
  nodejs:   <svg viewBox="0 0 24 24"><path fill="#339933" d="M11.998.001C5.374.001.001 5.375.001 12.002c0 6.626 5.373 11.999 11.997 11.999 6.625 0 12.001-5.373 12.001-11.999C24 5.375 18.623.001 11.998.001zm-.232 20.573c-.199 0-.394-.053-.563-.154L9.3 19.437c-.27-.151-.138-.204-.049-.235.335-.116.401-.143.758-.346.038-.022.088-.014.126.009l1.47.873a.192.192 0 0 0 .179 0l5.73-3.308a.181.181 0 0 0 .09-.157V7.725a.184.184 0 0 0-.09-.158L11.783 4.26a.18.18 0 0 0-.178 0L5.876 7.567a.184.184 0 0 0-.092.158v6.614c0 .064.034.124.091.155l1.567.905c.851.427 1.37-.076 1.37-.582V8.162c0-.093.074-.165.168-.165h.731c.091 0 .166.072.166.165v6.655c0 1.136-.619 1.789-1.697 1.789-.331 0-.592 0-1.322-.358l-1.503-.865a1.135 1.135 0 0 1-.562-.979V7.725c0-.403.215-.777.562-.978l5.731-3.31a1.172 1.172 0 0 1 1.126 0l5.729 3.31c.347.201.563.575.563.978v6.614c0 .404-.216.775-.563.978l-5.729 3.308a1.162 1.162 0 0 1-.564.149z"/></svg>,
  java:     <svg viewBox="0 0 24 24"><path fill="#ed8b00" d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149zm-.575-2.627s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218zm4.943 4.217c.17.144-.045.281-.045.281s-3.516.912-6.16.476c-1.773-.308-2.04-2.067 1.026-2.338 1.285-.11 3.117-.01 4.8.18.205.024.397.049.576.071l-.197.33zm-5.11 2.04c-.204 0-1.374-.33-1.374-.33-.136-.036-.296.002-.366.14-.132.256-.197.59-.197.97 0 .52.128 1 .456 1.254.433.337 1.16.29 1.574-.004.26-.186.374-.461.374-.764 0-.38-.16-.71-.467-.996v-.27zm8.218 1.456c1.007.487 1.84.86 1.84.86s-.486.565-2.02.675c-1.62.12-4.434-.15-5.96-.698 0 0 .28-.198.768-.414 1.61.576 3.977.842 5.372.577z"/></svg>,
  python:   <svg viewBox="0 0 24 24"><path fill="#3776ab" d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.83l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.23l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05L0 11.97l.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.24l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01z"/></svg>,
  php:      <svg viewBox="0 0 24 24"><path fill="#777bb4" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm-2.657-7.356l.396-2.044h2.01c.782 0 1.405-.126 1.868-.378.464-.252.764-.666.9-1.242.12-.513.058-.899-.185-1.158-.243-.259-.72-.388-1.43-.388h-1.951l-.613 3.123c-.068.344-.262.613-.581.806a1.739 1.739 0 0 1-.924.258c-.267 0-.483-.065-.649-.193a.594.594 0 0 1-.233-.53c0-.067.01-.142.031-.224l1.24-6.307a.99.99 0 0 1 .371-.602 1.078 1.078 0 0 1 .671-.212h4.244c1.292 0 2.258.339 2.9 1.016.64.677.882 1.617.724 2.818-.085.647-.277 1.239-.577 1.775a4.27 4.27 0 0 1-1.152 1.326c-.464.352-.993.617-1.588.793-.594.177-1.266.265-2.017.265H9.92l-.392 2-.586-.104z"/></svg>,
  django:   <svg viewBox="0 0 24 24"><path fill="#092e20" d="M11.146 0h3.924v18.166c-2.013.382-3.491.535-5.096.535-4.791 0-7.288-2.166-7.288-6.32 0-4.002 2.65-6.6 6.753-6.6.637 0 1.121.05 1.707.203zm0 9.143a3.894 3.894 0 0 0-1.325-.204c-1.988 0-3.134 1.223-3.134 3.365 0 2.09 1.096 3.236 3.109 3.236.433 0 .79-.025 1.35-.102V9.142zM21.314 6.06v11.107c0 3.84-.28 5.676-1.097 7.26-.764 1.53-1.757 2.497-3.822 3.56l-3.643-1.733c2.065-1.045 3.058-1.935 3.719-3.338.687-1.42.916-3.13.916-7.77V6.062l3.927.001z"/></svg>,
  mysql:    <svg viewBox="0 0 24 24"><path fill="#4479a1" d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.274.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.133-.04-.048-.107-.08-.18-.08v-.08zm-3.369 6.35c-.555-.055-1.116-.082-1.672-.117-.282-.017-.568-.017-.853-.03-.28-.013-.558-.04-.836-.05-.015.01-.033.01-.047.013-.023.01-.045.02-.072.026-.026.006-.054.01-.084.013H7.37c.19.055.393.09.587.134.195.048.388.096.586.138.194.042.394.08.59.118.194.04.393.08.59.118v.013c-.046.01-.09.01-.134.013-.044.003-.09.008-.133.013-.046.003-.09.01-.135.013-.042.006-.087.01-.132.016v.013c.2.016.4.03.6.04.2.01.4.016.597.023.198.008.396.014.594.018.197.005.396.01.593.01v.013l-.015.013c-.2.008-.4.013-.598.013-.197 0-.397-.005-.595-.014-.195-.01-.392-.02-.59-.035-.195-.013-.394-.03-.59-.05v.014c.2.025.397.053.597.075.197.02.397.038.594.056.2.015.396.03.595.04.197.01.394.014.594.016v.014c-.2.01-.4.016-.6.016-.2-.003-.4-.01-.597-.02-.2-.01-.397-.025-.596-.045-.195-.02-.39-.04-.586-.066v.013c.19.034.384.062.575.09.19.022.383.04.575.06.19.016.38.03.568.044.19.012.378.02.568.026v.013c-.007 0-.015.002-.022.005-.008.003-.016.01-.023.016-.007.007-.013.016-.018.025-.006.01-.01.02-.012.03v.015c.003.01.01.02.02.027.01.008.02.013.032.016.013.003.025.004.038.003.013 0 .026-.003.038-.008h.024c.157.012.313.02.47.026.16.005.317.008.476.01.16.002.316.004.475.004.16 0 .317-.002.475-.006v.014c-.158.006-.317.01-.475.014-.158.003-.316.004-.476.003-.158-.002-.315-.005-.474-.013-.157-.008-.316-.018-.473-.03v.013l.473.063c.158.02.316.04.476.055.16.015.317.025.476.033.158.006.318.008.476.006v.014c-.158 0-.318-.003-.476-.01-.158-.007-.318-.018-.475-.03-.158-.014-.315-.03-.472-.05-.158-.018-.314-.04-.473-.065h-.013v.014c.156.026.313.05.47.072.158.02.315.04.472.056.158.015.315.026.473.034.156.008.314.01.47.01v.013z"/></svg>,
  mongodb:  <svg viewBox="0 0 24 24"><path fill="#47a248" d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0 1 11.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 0 0 3.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z"/></svg>,
  sqlite:   <svg viewBox="0 0 24 24"><path fill="#003b57" d="M21.678.521C20.368-.551 18.795.05 16.89 1.235a9.648 9.648 0 0 0-.471.31 15.174 15.174 0 0 0-1.471-.615C12.958.32 10.695.1 8.635.535 2.006 1.871-1.148 9.648.5 17.502c.594 2.857 1.702 5.253 3.177 6.973.857.994 1.814 1.668 2.803 2.007.287.098.578.174.864.203a3.5 3.5 0 0 0 .572.021h.014c.148.004.298.007.449.007.895 0 1.801-.134 2.7-.39a14.07 14.07 0 0 0 1.648-.62c.246.042.489.077.727.102.287.03.571.046.855.046.895 0 1.788-.134 2.668-.389 1.28-.38 2.411-.997 3.394-1.815a13.22 13.22 0 0 0 3.134-4.147c1.396-2.87 1.876-6.518 1.165-10.165C23.5 5.853 22.67 1.338 21.678.521z"/></svg>,
  firebase: <svg viewBox="0 0 24 24"><path fill="#ffca28" d="M3.89 15.672L6.255.461A.542.542 0 0 1 7.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 0 0-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 0 0 1.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 0 0-.96 0L3.53 17.984z"/></svg>,
  git:      <svg viewBox="0 0 24 24"><path fill="#f05032" d="M23.546 10.93L13.067.452c-.604-.604-1.582-.604-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/></svg>,
  github:   <svg viewBox="0 0 24 24"><path fill="#e2e8f0" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
  linkedin: <svg viewBox="0 0 24 24"><path fill="#0a66c2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  figma:    <svg viewBox="0 0 24 24"><path fill="#f24e1e" d="M5.809 24c2.065 0 3.733-1.668 3.733-3.733v-3.733H5.809C3.744 16.534 2.076 18.202 2.076 20.267S3.744 24 5.809 24z"/><path fill="#ff7262" d="M2.076 12.267c0-2.065 1.668-3.733 3.733-3.733h3.733v7.467H5.809c-2.065 0-3.733-1.668-3.733-3.734z"/><path fill="#a259ff" d="M2.076 4.8C2.076 2.736 3.744 1.068 5.809 1.068h3.733V8.55H5.809C3.744 8.55 2.076 6.864 2.076 4.8z"/><path fill="#1abcfe" d="M9.542 1.068h3.733c2.065 0 3.733 1.668 3.733 3.733S15.34 8.534 13.275 8.534H9.542V1.068z"/><path fill="#0acf83" d="M17.009 12.267c0 2.065-1.668 3.733-3.733 3.733s-3.733-1.668-3.733-3.733 1.668-3.733 3.733-3.733 3.733 1.668 3.733 3.733z"/></svg>,
  vscode:   <svg viewBox="0 0 24 24"><path fill="#007acc" d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/></svg>,
  power_bi: <svg viewBox="0 0 24 24"><path fill="#f2c811" d="M0 0h24v24H0z"/><path fill="#241f21" d="M6 4h2.5v16H6zm3.5 3H12v13H9.5zm3.5 3h2.5v10H13zm3.5-5H19v15h-2.5z"/></svg>,
  typescript:<svg viewBox="0 0 24 24"><rect width="24" height="24" fill="#3178C6"/><text x="18" y="19" fill="#FFF" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="end">TS</text></svg>,
  tailwind: <svg viewBox="0 0 24 24" fill="none"><path d="M12.005 17.51c-3.13 0-4.914-1.57-5.353-4.71 1.884.629 3.14.314 3.768-.942-.942-.628-1.99-1.282-3.14-1.282-3.138 0-4.914 1.57-5.353 4.71 1.884-.628 3.14-.314 3.768.942.942.629 1.99 1.282 3.14 1.282 3.13 0 4.914-1.57 5.353-4.71-1.884-.629-3.14-.314-3.768.942.942.628 1.99 1.282 3.14 1.282zm5.353-8.48c-3.13 0-4.914-1.57-5.353-4.71 1.884.629 3.14.314 3.768-.942-.942-.628-1.99-1.282-3.14-1.282-3.138 0-4.914 1.57-5.353 4.71 1.884-.628 3.14-.314 3.768.942.942.629 1.99 1.282 3.14 1.282 3.13 0 4.914-1.57 5.353-4.71-1.884-.629-3.14-.314-3.768.942.942.628 1.99 1.282 3.14 1.282z" fill="#38bdf8"/></svg>,
  netlify:  <svg viewBox="0 0 24 24" fill="none"><path d="M21.36 10.02L12.42 2.31a.63.63 0 00-.84 0L2.64 10.02a.63.63 0 00.2 1.05l3.81 1.29-1.92 5.76a.63.63 0 00.9.72l15.12-9.45a.63.63 0 00.61-.39.63.63 0 00-.22-.68z" fill="#00C7B7"/></svg>,
  mcp:      <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill="#a78bfa" stroke="#c084fc" stroke-width="2"/><path d="M12 2v6M12 16v6M2 12h6M16 12h6" stroke="#c084fc" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="2" r="1.5" fill="#c084fc"/><circle cx="12" cy="22" r="1.5" fill="#c084fc"/><circle cx="2" cy="12" r="1.5" fill="#c084fc"/><circle cx="22" cy="12" r="1.5" fill="#c084fc"/></svg>,
};

const CV_PDF = '/Jeyarakavan_SoftwareEngineering_CV.pdf';
const CONTACT_EMAIL = 'jeyagandan74@gmail.com';

const CV = {
  name: 'Jeyarakavan Jeyakandan',
  role: 'Software Engineering | Full Stack Developer | Client-Focused Technologist',
  email: CONTACT_EMAIL,
  phone: '+94 74 004 5835',
  location: 'Jaffna, Sri Lanka',
  linkedin: 'https://www.linkedin.com/in/jeyarakavan-jeyakandan',
  github: 'https://github.com/Jeyarakavan',
  summary: 'Final-year Computer Science undergraduate with hands-on full-stack development experience and a strong technical foundation in HTML, CSS, JavaScript, React, Node.js, and Python. Skilled at translating client requirements into working solutions, leading projects from stakeholder requirement gathering to deployment. Proficient in web applications, database architecture, AI integration, and 3D web graphics.',

  skills: {
    'Frontend Development': [
      { name: 'HTML5', key: 'html5' }, { name: 'CSS3', key: 'css3' },
      { name: 'JavaScript', key: 'javascript' }, { name: 'React.js', key: 'react' },
      { name: 'TypeScript', key: 'typescript' }, { name: 'Tailwind CSS', key: 'tailwind' },
      { name: 'Bootstrap', key: 'bootstrap' }, { name: 'Figma', key: 'figma' }
    ],
    'Backend Development': [
      { name: 'Node.js', key: 'nodejs' }, { name: 'Java', key: 'java' },
      { name: 'Python', key: 'python' }, { name: 'PHP', key: 'php' },
      { name: 'Django', key: 'django' }, { name: 'Model Context Protocol (MCP)', key: 'mcp' }
    ],
    'Databases': [
      { name: 'MySQL', key: 'mysql' }, { name: 'MongoDB', key: 'mongodb' },
      { name: 'PostgreSQL', key: 'sqlite' }, { name: 'SQLite', key: 'sqlite' },
      { name: 'Firebase', key: 'firebase' }
    ],
    '3D Animation & Graphics': [
      { name: 'Three.js', key: 'react' }, { name: 'WebGL Canvas', key: 'html5' },
      { name: 'CSS Keyframes', key: 'css3' }, { name: 'Interactive UI', key: 'figma' }
    ],
    'Tools & Platforms': [
      { name: 'Git/GitHub', key: 'git' }, { name: 'VS Code', key: 'vscode' },
      { name: 'Power BI', key: 'power_bi' }, { name: 'GitHub', key: 'github' },
      { name: 'Netlify', key: 'netlify' }
    ]
  },

  experience: [
    {
      id: 1,
      period: '2025 Nov — 2026 May',
      role: 'Software Engineer Intern',
      company: 'HABB (Pvt) Ltd',
      type: 'Internship',
      bullets: [
        'Developed and maintained web application features based on stakeholder requirements, contributing to both frontend and backend implementation using modern frameworks.',
        'Designed and optimized database schemas and REST API endpoints to support core business workflows, improving data retrieval efficiency.',
        'Built internal reporting and dashboard modules, reducing manual data processing steps and enhancing operational visibility.',
        'Collaborated with design and backend teams in an Agile/Scrum environment, participating in sprints to ensure timely and on-spec feature delivery.'
      ],
      tags: ['React', 'Node.js', 'REST API', 'MySQL', 'Agile/Scrum'],
      documents: [], photos: []
    },
    {
      id: 2,
      period: '2022 Sep — 2023 Mar',
      role: 'IT Technician Intern',
      company: 'University of Jaffna – General Administration Department',
      type: 'Internship',
      bullets: [
        'Installed, configured, and maintained hardware and software systems, ensuring reliable IT infrastructure for daily administrative operations.',
        'Diagnosed and resolved technical issues, preparing incident reports and maintenance logs to support data-driven operational decision-making.',
        'Coordinated with administrative staff to gather technical requirements and deliver effective, timely IT solutions.'
      ],
      tags: ['Hardware', 'Software Systems', 'IT Infrastructure', 'Technical Support'],
      documents: [], photos: []
    }
  ],

  education: [
    {
      degree: 'BSc (Hons) in Computer Science',
      institution: 'University of Bedfordshire, UK',
      campus: '(delivered at SLIIT Northern Uni, Jaffna)',
      year: '2024 – 2027 (Expected)',
      logo: bedfordshireLogo,
      desc: 'Final-year Computer Science degree focusing on software engineering, web architectures, AI/ML, and intelligent systems.'
    },
    {
      degree: 'Higher Diploma in IT',
      institution: 'Southern Campus (SCU)',
      year: 'Jun 2024 – Jun 2026',
      logo: scuLogo,
      desc: 'Completed Higher Diploma in Information Technology covering web development, database systems, and software engineering principles.'
    },
    {
      degree: 'NVQ Level 4 – Information Technology',
      institution: 'College of Technology, Jaffna',
      year: 'Jan 2022 – Dec 2022',
      desc: 'Core IT qualification in computer software maintenance, networking, and system administration.'
    },
    {
      degree: 'Advanced Level – Engineering Technology',
      institution: 'J/ Kokuvil Hindu College',
      year: '2011 – 2021',
      desc: 'G.C.E. Advanced Level in Engineering Technology and physical science foundations.'
    }
  ],

  projects: [
    {
      id: 1,
      title: 'Kapruka AI Shopping Agent',
      type: 'Kapruka Agent Challenge | Jun – Jul 2026',
      desc: 'Built an AI-powered conversational shopping assistant integrating the Kapruka MCP (Model Context Protocol) to enable natural-language product search, AI-driven recommendations, delivery availability checks, and order tracking through a chat interface. Built with React, TypeScript, Tailwind CSS, and Node.js; deployed on Netlify with certificate from Kapruka Holdings PLC.',
      tech: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Kapruka MCP', 'AI APIs', 'Netlify'],
      badge: 'AI / E-Commerce', badgeType: 'badge-blue',
      github: 'https://github.com/Jeyarakavan',
      demo: '',
      banner: 'kapruka_genie.png',
      shape: 'icosa', color1: 0x4f46e5, color2: 0x06b6d4
    },
    {
      id: 2,
      title: 'CivicGuard AI — Civic Hazard Image Classifier',
      type: 'Group Project | Machine Learning',
      desc: 'Built an image classification system to detect five civic hazard categories (blocked drains, sewage overflow, road damage, fallen trees, water logging) using MobileNetV2 transfer learning on Kaggle Notebooks. Implemented two-phase fine-tuning, class weighting for imbalanced categories, and early stopping to achieve high accuracy.',
      tech: ['Python', 'MobileNetV2', 'TensorFlow', 'Kaggle', 'Transfer Learning', 'Computer Vision'],
      badge: 'AI / Computer Vision', badgeType: 'badge-cyan',
      github: 'https://github.com/Jeyarakavan',
      demo: '',
      banner: '',
      shape: 'octahedron', color1: 0x059669, color2: 0x10b981
    },
    {
      id: 3,
      title: 'AI Receptionist System',
      type: 'Final Year Project | Team Lead | Group Project',
      desc: 'Designed and developed a full-stack AI-powered receptionist system with a React frontend and Django REST backend, integrated with a multi-agent architecture for appointment booking, patient coordination, and automated data handling.',
      tech: ['React', 'Django', 'PostgreSQL', 'MongoDB', 'Multi-Agent AI', 'REST API'],
      badge: 'AI / Full Stack', badgeType: 'badge-blue',
      github: 'https://github.com/Jeyarakavan',
      demo: '',
      banner: 'ai_receptionist.png',
      shape: 'torus', color1: 0x1e3a8a, color2: 0x60a5fa
    }
  ],

  achievements: [
    { id: 1, title: 'Kapruka Agent Challenge (2026) — Certificate of Participation', year: '2026', type: 'award', description: 'Awarded by Kapruka Holdings PLC (KPHL) for building AI Shopping Agent', issuer: 'Kapruka Holdings PLC' },
    { id: 2, title: 'Q4US Codeart Challenge – Winners', year: '2025', type: 'award', description: 'First place winners in UI/UX and web implementation challenge', issuer: 'Q4US' },
    { id: 3, title: 'SLIIT Codefest NETCOM – Merit Award', year: '2025', type: 'award', description: 'Recognized for network engineering and cloud infrastructure design', issuer: 'SLIIT' },
    { id: 4, title: 'Marketing Video Clip Competition – Winners', year: '2025', type: 'award', description: 'First place winners for promotional tech video content creation', issuer: 'SLIIT' },
    { id: 5, title: 'SLIIT Codefest ALGOTHAN – Merit Award', year: '2024', type: 'award', description: 'Merit recognition for algorithmic problem solving under pressure', issuer: 'SLIIT' }
  ],

  languages: ['Tamil (Native)', 'English (Professional Proficiency)'],

  volunteering: {
    org: 'Sri Lankan Scout Association',
    role: 'Scout',
    period: '2010 – Present',
    award: "President's Award (2019) – Awarded for exceptional community service and dedication, one of the highest honors in the Sri Lanka Scout movement."
  }
};

const BLOG_POSTS = [
  {
    id: 1,
    title: 'Kapruka MCP Agent Challenge 2026: Building Conversational E-Commerce',
    category: 'Workshops',
    date: 'Jul 2026',
    readTime: '4 min read',
    summary: 'Insights and architecture breakdown from participating in the Kapruka Agent Challenge, integrating Model Context Protocol (MCP) into a full-stack React application.',
    content: `
      During the Kapruka Agent Challenge (Jun - Jul 2026), I designed and built an AI-powered conversational shopping assistant that connects users directly to Kapruka's online marketplace using the Model Context Protocol (MCP).
      
      ### Key Architectural Features:
      - **Natural Language Product Discovery**: Users can search for items using conversational queries across English, Sinhala, Tamil, and Tanglish.
      - **MCP Tool Integration**: Querying live delivery availability, tracking orders, and receiving personalized product recommendations via structured AI context protocols.
      - **Responsive Chat Interface**: Built using React, TypeScript, Tailwind CSS, and Node.js for seamless desktop and mobile accessibility.
      
      Participating in this challenge expanded my understanding of next-generation LLM tooling, agent workflows, and real-time e-commerce API integrations!
    `,
    tags: ['Kapruka MCP', 'AI Agent', 'React', 'TypeScript', 'Node.js']
  },
  {
    id: 2,
    title: 'Building Multi-Agent Architectures with Django REST & React',
    category: 'Technical Journals',
    date: 'May 2026',
    readTime: '5 min read',
    summary: 'How my team designed an AI Hospital Receptionist System using multi-agent task delegation and seamless REST API orchestration.',
    content: `
      As Team Lead for our final-year project, we set out to automate hospital appointment scheduling and patient coordination using AI agents.
      
      ### Core System Components:
      1. **Multi-Agent Coordinator**: Orchestrates specialized agents for appointment validation, doctor schedule lookups, and patient intake.
      2. **Django REST Backend**: Secure Python backend handling data persistence across PostgreSQL and MongoDB databases.
      3. **React Dynamic Dashboard**: Provides hospital administration and patients real-time updates without page reloads.
      
      This project reinforced the importance of clear API contracts and robust error handling in multi-agent asynchronous workflows.
    `,
    tags: ['Multi-Agent AI', 'Django REST', 'React', 'Full Stack', 'System Architecture']
  },
  {
    id: 3,
    title: 'SLIIT Codefest & NETCOM Competition Journey',
    category: 'Events',
    date: 'Nov 2025',
    readTime: '3 min read',
    summary: 'Recap of competing in SLIIT Codefest NETCOM & ALGOTHAN hackathons, focusing on competitive problem solving and network engineering.',
    content: `
      Competing in SLIIT Codefest allowed me to test system engineering and algorithmic problem-solving skills under strict time limits.
      
      ### Highlights & Awards:
      - **SLIIT Codefest NETCOM Merit Award**: Demonstrated advanced networking concepts and cloud infrastructure design.
      - **SLIIT Codefest ALGOTHAN Merit Award**: Efficient algorithm implementation and data structures optimization.
      - **Q4US Codeart Challenge Winner**: Creative solution design and frontend interactive execution.
      
      Collaborating under pressure reinforced my passion for continuous tech learning and team leadership!
    `,
    tags: ['Hackathons', 'SLIIT Codefest', 'Awards', 'Networking', 'Problem Solving']
  },
  {
    id: 4,
    title: 'Integrating Interactive 3D Canvas & WebGL in Modern Portfolios',
    category: 'Technical Journals',
    date: 'Jan 2026',
    readTime: '4 min read',
    summary: 'A deep dive into using Three.js, dynamic particle systems, and lightweight shaders to elevate web UI aesthetics without sacrificing speed.',
    content: `
      Modern web development is moving towards immersive, dynamic user interfaces. Adding 3D elements can dramatically enhance visual appeal when implemented thoughtfully.
      
      ### Best Practices for WebGL Canvas:
      - **Asynchronous & Lazy Loading**: Load 3D assets lazily so initial page load remains instant.
      - **Graceful Fallbacks**: Ensure mobile users on low-power devices experience smooth 60fps animations.
      - **Subtle Ambient Motion**: Avoid overwhelming the user; use 3D shapes to accent key sections like interactive skill globes and tech cards.
    `,
    tags: ['Three.js', 'WebGL', 'Frontend', 'Web Animation', 'UI/UX']
  }
];

const useReveal = () => {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('in-view'), i * 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
};

const Lightbox = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}><X size={22} /></button>
      <img src={src} alt="Certificate" className="lightbox-img" onClick={e => e.stopPropagation()} />
    </div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [navCompact, setNavCompact] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [achievTab, setAchievTab] = useState('awards');
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [showBackToTop, setShowBackToTop] = useState(false);

  const [blogCategory, setBlogCategory] = useState('All');
  const [blogSearch, setBlogSearch] = useState('');
  const [activeBlogPost, setActiveBlogPost] = useState(null);

  useEffect(() => {
    document.body.className = darkMode ? '' : 'light';
  }, [darkMode]);

  useEffect(() => {
    const onScroll = () => {
      setNavCompact(window.scrollY > 60);
      setShowBackToTop(window.scrollY > 500);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 200) setActiveSection(s.id);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileNavOpen]);

  // Typewriter effect
  useEffect(() => {
    const roles = [
      'Full Stack Developer',
      'AI/ML Enthusiast',
      'CS Undergraduate',
      'Software Engineer',
      'React & Node.js Dev',
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timeout;
    const type = () => {
      const current = roles[roleIdx];
      if (!deleting) {
        setTypewriterText(current.slice(0, charIdx + 1));
        charIdx++;
        if (charIdx === current.length) {
          deleting = true;
          timeout = setTimeout(type, 1800);
          return;
        }
      } else {
        setTypewriterText(current.slice(0, charIdx - 1));
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
        }
      }
      timeout = setTimeout(type, deleting ? 45 : 80);
    };
    timeout = setTimeout(type, 600);
    return () => clearTimeout(timeout);
  }, []);

  useReveal();

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'blogs', label: 'Blogs' },
    { id: 'achievements', label: 'Awards' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormStatus('');
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _subject: `Portfolio Contact: ${formData.subject}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });
      const data = await response.json();
      if (data.success) {
        setFormStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFinish = useCallback(() => {
    setLoading(false);
  }, []);

  const awards = CV.achievements.filter(a => a.type !== 'certification');
  const certs = CV.achievements.filter(a => a.type === 'certification');

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress-bar" style={{ transform: `scaleX(${scrollProgress / 100})` }} />

      <Preloader onFinish={handleFinish} />



      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      <StarBackground />
      <div className="noise" />

      <nav className={`navbar${navCompact ? ' compact' : ''}`}>
        <a href="#hero" className="nav-brand">
          <span className="nav-name">Jeyarakavan Jeyakandan</span>
        </a>
        <div className="nav-actions">
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} title={darkMode ? 'Switch to Light' : 'Switch to Dark'} aria-label="Toggle theme">
            <span className="theme-toggle-icon">{darkMode ? '🌙' : '☀️'}</span>
            <span className="theme-toggle-label">{darkMode ? 'Dark' : 'Light'}</span>
          </button>
          <a href={CV_PDF} download="Jeyarakavan_SoftwareEngineering_CV.pdf" className="btn-download">
            <Download size={13} /> CV
          </a>
          <button
            className={`nav-menu-toggle${mobileNavOpen ? ' open' : ''}`}
            onClick={() => setMobileNavOpen(v => !v)}
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNavOpen}
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile nav drawer — rendered OUTSIDE nav to escape backdrop-filter stacking context */}
      <ul className={`nav-links${mobileNavOpen ? ' open' : ''}`}>
        {navItems.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={activeSection === item.id ? 'active' : ''}
              onClick={() => setMobileNavOpen(false)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      {mobileNavOpen && (
        <div className="nav-mobile-overlay" onClick={() => setMobileNavOpen(false)} aria-hidden="true" />
      )}

      <section id="hero">
        {/* Animated background blobs */}
        <div className="hero-bg-blobs">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
        </div>
        <div className="hero-inner">
          <div className="hero-text">
            <h1 className="hero-name">
              <span className="gradient-text">Jeyarakavan</span>
              <br />Jeyakandan
            </h1>
            <p className="hero-typewriter">
              {typewriterText}<span className="typewriter-cursor" />
            </p>
            <p className="hero-desc">{CV.summary.slice(0, 240)}…</p>
            <div className="hero-cta">
              <a href="#projects" className="btn-primary">View Projects</a>
              <a href="#ai-assistant" className="btn-ai-cta">
                <Sparkles size={14} /> Ask AI Assistant
              </a>
              <a href="#contact" className="btn-outline">Get In Touch</a>
              <a href={CV_PDF} download="Jeyarakavan_SoftwareEngineering_CV.pdf" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <Download size={14} /> Download CV
              </a>
            </div>
            <div className="hero-socials">
              <a href={CV.linkedin} target="_blank" rel="noopener noreferrer" className="hero-social-link">
                <span className="hero-social-icon">{logos.linkedin}</span> LinkedIn
              </a>
              <a href={CV.github} target="_blank" rel="noopener noreferrer" className="hero-social-link">
                <span className="hero-social-icon">{logos.github}</span> GitHub
              </a>
            </div>
          </div>
          {/* Circular avatar with gradient ring */}
          <div className="hero-visual hero-visual-large">
            <div className="hero-avatar-wrapper">
              <div className="hero-avatar-ring" />
              <img src={profilePhoto} alt="Jeyarakavan Jeyakandan" className="hero-avatar-img" />
            </div>
          </div>
        </div>
      </section>

      {/* AI Portfolio Assistant Section directly under Profile */}
      <section id="ai-assistant" style={{ padding: '2.25rem 5vw 1.75rem' }}>
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <span className="section-label" style={{ justifyContent: 'center' }}>// Interactive AI</span>
            <h2 className="section-title">Ask My <em>AI Assistant</em></h2>
            <p className="section-desc" style={{ margin: '0 auto', maxWidth: '560px', fontSize: '0.85rem' }}>
              Have questions about my technical background, projects, internship experience, or skills? Ask my custom AI assistant below!
            </p>
            <div className="section-divider" style={{ margin: '1rem auto 0' }} />
          </div>
          <div className="reveal">
            <AIChatBot embedded={true} />
          </div>
        </div>
      </section>

      <section id="about">
        <div className="section-inner">
          <div className="about-full reveal">
            <span className="section-label">// About Me</span>
            <h2 className="section-title">Building the <em>Future</em> of Software</h2>
            <div className="section-divider" />
            <div className="about-two-col">
              <div className="about-text-col">
                <p className="about-p">{CV.summary}</p>
                <p className="about-p">
                  I am currently in the 3rd year of my BSc (Hons) in Computer Science at University of Bedfordshire (delivered at SLIIT Northern Uni). My internship at HABB (Pvt) Ltd gave me hands-on experience in Agile environments, building real-world features that directly impacted business workflows.
                </p>
                <p className="about-p">
                  Beyond coding, I am a Scout with a President's Award — a recognition of leadership, community service, and dedication.
                </p>
              </div>
              <div className="about-stats-col">
                <div className="about-stats">
                  <div className="stat-box">
                    <div className="stat-num">3+</div>
                    <div className="stat-label">Years Coding</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-num">3+</div>
                    <div className="stat-label">Core Projects</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-num">5</div>
                    <div className="stat-label">Awards</div>
                  </div>
                </div>
                <div className="about-info-list">
                  <div className="about-info-item"><span>Degree</span><span>BSc (Hons) Computer Science</span></div>
                  <div className="about-info-item"><span>University</span><span>Bedfordshire / SLIIT Northern</span></div>
                  <div className="about-info-item"><span>Higher Diploma</span><span>SCU (Jun 2024 - Jun 2026)</span></div>
                  <div className="about-info-item"><span>Location</span><span>Jaffna, Sri Lanka</span></div>
                  <div className="about-info-item"><span>Languages</span><span>Tamil · English</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills">
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: 'center' }}>
            <span className="section-label" style={{ justifyContent: 'center' }}>// Expertise</span>
            <h2 className="section-title">Skills &amp; <em>Technologies</em></h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>Explore the interactive 3D skill globe or browse the detailed tech stack matrix below.</p>
            <div className="section-divider" style={{ margin: '1.5rem auto 2rem' }} />
          </div>
          <Suspense fallback={<div style={{ height: 420 }} />}>
            <SkillGlobe logos={logos} skills={CV.skills} />
          </Suspense>

          {/* Interactive Skills Table Matrix */}
          <div className="skills-table-wrapper reveal" style={{ marginTop: '3.5rem' }}>
            <h3 className="skills-table-title">
              <Sparkles size={18} style={{ color: 'var(--blue-4)' }} /> Comprehensive Technical Skills Matrix
            </h3>
            <div className="table-responsive">
              <table className="skills-matrix-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Technologies &amp; Frameworks</th>
                    <th>Proficiency</th>
                    <th>Applied Key Projects</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="cat-cell"><strong>Frontend Development</strong></td>
                    <td>
                      <div className="tech-chip-group">
                        <span className="tech-badge">React.js</span>
                        <span className="tech-badge">TypeScript</span>
                        <span className="tech-badge">JavaScript (ES6+)</span>
                        <span className="tech-badge">HTML5 / CSS3</span>
                        <span className="tech-badge">Tailwind CSS</span>
                        <span className="tech-badge">Bootstrap</span>
                        <span className="tech-badge">Figma</span>
                      </div>
                    </td>
                    <td><span className="prof-tag level-advanced">Advanced</span></td>
                    <td>Kapruka MCP Agent, AI Receptionist, HABB Internship</td>
                  </tr>
                  <tr>
                    <td className="cat-cell"><strong>Backend Engineering</strong></td>
                    <td>
                      <div className="tech-chip-group">
                        <span className="tech-badge">Node.js</span>
                        <span className="tech-badge">Django</span>
                        <span className="tech-badge">Python</span>
                        <span className="tech-badge">Java</span>
                        <span className="tech-badge">PHP</span>
                        <span className="tech-badge">REST APIs</span>
                        <span className="tech-badge">Model Context Protocol (MCP)</span>
                      </div>
                    </td>
                    <td><span className="prof-tag level-advanced">Advanced</span></td>
                    <td>AI Receptionist Backend, Kapruka Agent Challenge</td>
                  </tr>
                  <tr>
                    <td className="cat-cell"><strong>Databases &amp; Storage</strong></td>
                    <td>
                      <div className="tech-chip-group">
                        <span className="tech-badge">MySQL</span>
                        <span className="tech-badge">MongoDB</span>
                        <span className="tech-badge">PostgreSQL</span>
                        <span className="tech-badge">SQLite</span>
                        <span className="tech-badge">Firebase</span>
                      </div>
                    </td>
                    <td><span className="prof-tag level-proficient">Proficient</span></td>
                    <td>HABB Workflow Systems, Hospital Record Database</td>
                  </tr>
                  <tr>
                    <td className="cat-cell"><strong>3D Animation &amp; Graphics</strong></td>
                    <td>
                      <div className="tech-chip-group">
                        <span className="tech-badge">Three.js</span>
                        <span className="tech-badge">WebGL Canvas</span>
                        <span className="tech-badge">CSS Keyframes</span>
                        <span className="tech-badge">Interactive 3D UI</span>
                      </div>
                    </td>
                    <td><span className="prof-tag level-proficient">Proficient</span></td>
                    <td>Portfolio Interactive Globe &amp; 3D Visualizers</td>
                  </tr>
                  <tr>
                    <td className="cat-cell"><strong>Tools &amp; Platforms</strong></td>
                    <td>
                      <div className="tech-chip-group">
                        <span className="tech-badge">Git / GitHub</span>
                        <span className="tech-badge">VS Code</span>
                        <span className="tech-badge">Netlify</span>
                        <span className="tech-badge">Power BI</span>
                        <span className="tech-badge">Android Studio</span>
                      </div>
                    </td>
                    <td><span className="prof-tag level-proficient">Proficient</span></td>
                    <td>CI/CD Deployment, Version Control, Analytics</td>
                  </tr>
                  <tr>
                    <td className="cat-cell"><strong>Project &amp; Soft Skills</strong></td>
                    <td>
                      <div className="tech-chip-group">
                        <span className="tech-badge">Agile / Scrum</span>
                        <span className="tech-badge">Sprint Planning</span>
                        <span className="tech-badge">Problem Solving</span>
                        <span className="tech-badge">Team Leadership</span>
                      </div>
                    </td>
                    <td><span className="prof-tag level-experienced">Experienced</span></td>
                    <td>HABB Internship Team, Group Project Leadership</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="experience">
        <div className="section-inner">
          <div className="reveal">
            <span className="section-label">// Professional Journey</span>
            <h2 className="section-title">Work <em>Experience</em></h2>
            <div className="section-divider" />
          </div>
          <div className="exp-timeline">
            {CV.experience.map((exp, i) => (
              <div className="exp-item reveal" key={exp.id || i} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="exp-dot" />
                <div className="exp-period">{exp.period}</div>
                <h3 className="exp-role">{exp.role}</h3>
                <div className="exp-company">
                  <span>{exp.company}</span>
                  <span className="exp-company-badge">{exp.type}</span>
                </div>
                <ul className="exp-bullets">
                  {(Array.isArray(exp.bullets) ? exp.bullets : JSON.parse(exp.bullets || '[]')).map((b, j) => <li key={j}>{b}</li>)}
                </ul>
                <div className="exp-tags">
                  {(Array.isArray(exp.tags) ? exp.tags : JSON.parse(exp.tags || '[]')).map(t => <span className="exp-tag" key={t}>{t}</span>)}
                </div>
                {exp.photos && exp.photos.length > 0 && (
                  <div className="exp-attachments">
                    {exp.photos.map((ph, pi) => (
                      <img key={pi} src={`/uploads/${ph}`} alt="attachment"
                        className="exp-thumb" onClick={() => setLightboxSrc(`/uploads/${ph}`)} />
                    ))}
                  </div>
                )}
                {exp.documents && exp.documents.length > 0 && (
                  <div className="exp-docs">
                    {exp.documents.map((doc, di) => (
                      <a key={di} href={`/uploads/${doc}`} target="_blank" rel="noopener noreferrer" className="exp-doc-link">
                        <FileText size={13} /> {doc}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="education">
        <div className="section-inner">
          <div className="reveal">
            <span className="section-label">// Academic Background</span>
            <h2 className="section-title">Education &amp; <em>Qualifications</em></h2>
            <div className="section-divider" />
          </div>
          <div className="edu-grid">
            {CV.education.map((edu, i) => (
              <div className="edu-card reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="edu-card-top">
                  {edu.logo ? (
                    <div className="edu-logo-box">
                      <img src={edu.logo} alt={edu.institution} className="edu-inst-logo" />
                    </div>
                  ) : (
                    <div className="edu-icon"><GraduationCap size={22} /></div>
                  )}
                  <div className="edu-year">{edu.year}</div>
                </div>
                <div className="edu-degree">{edu.degree}</div>
                <div className="edu-institution-line">
                  <strong>{edu.institution}</strong> {edu.campus && <span className="edu-campus-text">{edu.campus}</span>}
                </div>
                {edu.desc && <p className="edu-desc">{edu.desc}</p>}
              </div>
            ))}
          </div>
          <div className="reveal" style={{ marginTop: '3rem' }}>
            <div className="skill-category-title">Languages</div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {CV.languages.map(l => (
                <span key={l} style={{
                  padding: '0.55rem 1.35rem', borderRadius: '99px',
                  background: 'var(--surface-1)', border: '1px solid var(--border)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--blue-4)'
                }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="projects">
        <div className="section-inner">
          <div className="reveal">
            <span className="section-label">// Featured Work</span>
            <h2 className="section-title">Relevant <em>Projects</em></h2>
            <div className="section-divider" />
          </div>
          {/* Project Filter Bar */}
          <div className="projects-filter-bar reveal">
            {['All', 'AI/ML', 'Full Stack'].map(cat => (
              <button
                key={cat}
                className={`filter-btn${projectFilter === cat ? ' active' : ''}`}
                onClick={() => setProjectFilter(cat)}
              >{cat}</button>
            ))}
          </div>
          <div className="projects-grid">
            {CV.projects
              .filter(proj => {
                if (projectFilter === 'All') return true;
                if (projectFilter === 'AI/ML') return proj.type?.toLowerCase().includes('ai') || proj.type?.toLowerCase().includes('ml') || proj.type?.toLowerCase().includes('challenge');
                if (projectFilter === 'Full Stack') return proj.type?.toLowerCase().includes('full stack') || proj.type?.toLowerCase().includes('fullstack') || proj.type?.toLowerCase().includes('team lead');
                return true;
              })
              .map((proj, i) => (
              <div className="proj-card reveal" key={proj.id || i} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="proj-thumb">
                  {proj.banner ? (
                    <img src={`/uploads/${proj.banner}`} alt={proj.title} className="proj-banner-img" />
                  ) : (
                    <>
                      <div className={`proj-thumb-bg p${i+1}`}
                        style={{ background: `linear-gradient(135deg, rgba(${i%2?'5,15,40':'7,10,30'},0.9), rgba(10,20,60,0.8))` }} />
                      <Suspense fallback={<div style={{ height: 200, background: 'var(--surface-1)', borderRadius: 8 }} />}>
                        <ProjectCanvas shape={proj.shape} color1={proj.color1 || 0x1e3a8a} color2={proj.color2 || 0x60a5fa} />
                      </Suspense>
                    </>
                  )}
                  <div className={`proj-badge ${proj.badgeType || 'badge-blue'}`}>{proj.badge}</div>
                </div>
                <div className="proj-body">
                  <h3 className="proj-title">{proj.title}</h3>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.06em' }}>
                    {proj.type}
                  </p>
                  <p className="proj-desc">{proj.desc || proj.description}</p>
                  <div className="proj-tech">
                    {(Array.isArray(proj.tech) ? proj.tech : JSON.parse(proj.tech || '[]')).map(t => <span className="tech-chip" key={t}>{t}</span>)}
                  </div>
                  <div className="proj-links">
                    {proj.github && (
                      <a href={proj.github} target="_blank" rel="noopener noreferrer" className="proj-link">
                        <span style={{ width: 14, height: 14, display: 'inline-block' }}>{logos.github}</span> GitHub
                      </a>
                    )}
                    {proj.demo && (
                      <a href={proj.demo} target="_blank" rel="noopener noreferrer" className="proj-link proj-link-demo">
                        <ExternalLink size={13} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blogs & Journals Section */}
      <section id="blogs">
        <div className="section-inner">
          <div className="reveal">
            <span className="section-label">// Journals &amp; Activity</span>
            <h2 className="section-title">Blogs, Workshops &amp; <em>Events</em></h2>
            <div className="section-divider" />
            <p className="section-desc">My technical journal documenting workshops, hackathons, software architecture insights, and tech events.</p>
          </div>

          <div className="blogs-controls reveal">
            <div className="blogs-categories">
              {['All', 'Workshops', 'Events', 'Technical Journals'].map(cat => (
                <button
                  key={cat}
                  className={`filter-btn${blogCategory === cat ? ' active' : ''}`}
                  onClick={() => setBlogCategory(cat)}
                >{cat}</button>
              ))}
            </div>
            <div className="blogs-search-wrap">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search blog posts or topics..."
                value={blogSearch}
                onChange={e => setBlogSearch(e.target.value)}
                className="blogs-search-input"
              />
            </div>
          </div>

          <div className="blogs-grid">
            {BLOG_POSTS
              .filter(post => {
                const matchCat = blogCategory === 'All' || post.category === blogCategory;
                const matchSearch = blogSearch === '' || 
                  post.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
                  post.summary.toLowerCase().includes(blogSearch.toLowerCase()) ||
                  post.tags.some(t => t.toLowerCase().includes(blogSearch.toLowerCase()));
                return matchCat && matchSearch;
              })
              .map((post, i) => (
                <article className="blog-card reveal" key={post.id} style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="blog-card-meta">
                    <span className="blog-badge">{post.category}</span>
                    <span className="blog-date"><Calendar size={12} /> {post.date}</span>
                    <span className="blog-time"><Clock size={12} /> {post.readTime}</span>
                  </div>
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-summary">{post.summary}</p>
                  <div className="blog-card-tags">
                    {post.tags.map(t => <span key={t} className="blog-tag">#{t}</span>)}
                  </div>
                  <button className="btn-blog-read" onClick={() => setActiveBlogPost(post)}>
                    Read Entry <ArrowRight size={14} />
                  </button>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* Blog Detail Modal */}
      {activeBlogPost && (
        <div className="blog-modal-overlay" onClick={() => setActiveBlogPost(null)}>
          <div className="blog-modal-content" onClick={e => e.stopPropagation()}>
            <button className="blog-modal-close" onClick={() => setActiveBlogPost(null)}>
              <X size={20} />
            </button>
            <div className="blog-modal-header">
              <span className="blog-badge">{activeBlogPost.category}</span>
              <div className="blog-modal-meta">
                <span><Calendar size={13} /> {activeBlogPost.date}</span>
                <span><Clock size={13} /> {activeBlogPost.readTime}</span>
              </div>
              <h2 className="blog-modal-title">{activeBlogPost.title}</h2>
              <div className="blog-card-tags" style={{ marginTop: '0.75rem' }}>
                {activeBlogPost.tags.map(t => <span key={t} className="blog-tag">#{t}</span>)}
              </div>
            </div>
            <div className="blog-modal-body">
              {activeBlogPost.content.split('\n\n').map((paragraph, idx) => {
                const trimmed = paragraph.trim();
                if (trimmed.startsWith('### ')) {
                  return <h3 key={idx} className="blog-h3">{trimmed.replace('### ', '')}</h3>;
                }
                if (trimmed.startsWith('- ')) {
                  return (
                    <ul key={idx} className="blog-ul">
                      {trimmed.split('\n').map((item, itemIdx) => (
                        <li key={itemIdx}>{item.replace('- ', '')}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={idx} className="blog-p">{trimmed}</p>;
              })}
            </div>
          </div>
        </div>
      )}

      <section id="achievements">
        <div className="section-inner">
          <div className="reveal">
            <span className="section-label">// Recognition</span>
            <h2 className="section-title">Awards, Achievements &amp; <em>Certifications</em></h2>
            <div className="section-divider" />
          </div>

          <div className="achiev-tabs reveal">
            <button className={`achiev-tab${achievTab === 'awards' ? ' active' : ''}`} onClick={() => setAchievTab('awards')}>
              <Award size={15} /> Awards & Achievements
            </button>
            <button className={`achiev-tab${achievTab === 'certs' ? ' active' : ''}`} onClick={() => setAchievTab('certs')}>
              <FileText size={15} /> Certifications
            </button>
          </div>

          {achievTab === 'awards' && (
            <div className="achievements-grid" style={{ marginTop: '2rem' }}>
              {awards.map((a, i) => (
                <div className="achievement-card reveal" key={a.id || i}>
                  <div className="achievement-icon"><Award size={20} /></div>
                  <div className="achievement-text">
                    <div className="achievement-title">{a.title}</div>
                    <div className="achievement-year">{a.year}</div>
                    {a.description && <div className="achievement-desc">{a.description}</div>}
                    {a.issuer && <div className="achievement-issuer">{a.issuer}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {achievTab === 'certs' && (
            <div className="certs-grid" style={{ marginTop: '2rem' }}>
              {certs.length === 0 ? (
                <div className="certs-empty">No certifications added yet.</div>
              ) : certs.map((c, i) => (
                <div className="cert-card reveal" key={c.id || i}>
                  {c.certificate_image && (
                    <div className="cert-img-wrap" onClick={() => setLightboxSrc(`/uploads/${c.certificate_image}`)}>
                      <img src={`/uploads/${c.certificate_image}`} alt={c.title} className="cert-img" />
                      <div className="cert-img-overlay"><Eye size={18} /></div>
                    </div>
                  )}
                  <div className="cert-body">
                    <div className="cert-title">{c.title}</div>
                    <div className="cert-meta">
                      {c.issuer && <span className="cert-issuer">{c.issuer}</span>}
                      {c.year && <span className="cert-year">{c.year}</span>}
                    </div>
                    {c.description && <p className="cert-desc">{c.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '4rem' }} className="reveal">
            <span className="section-label">// Volunteering</span>
            <div className="volunteer-card" style={{ marginTop: '1.5rem' }}>
              <div className="volunteer-icon">⚜️</div>
              <div>
                <div className="volunteer-title">{CV.volunteering.role} – {CV.volunteering.org}</div>
                <div className="volunteer-period">{CV.volunteering.period}</div>
                <p className="volunteer-desc">{CV.volunteering.award}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="section-inner">
          <div className="contact-grid">
            <div>
              <span className="section-label">// Let's Connect</span>
              <h2 className="section-title">Get In <em>Touch</em></h2>
              <div className="section-divider" />
              <p className="section-desc">
                Open to full-stack development roles, AI/ML projects, research collaborations, and software engineering opportunities. Let's build something impactful together.
              </p>
              <div className="contact-cards">
                <a href={`mailto:${CV.email}`} className="contact-card">
                  <div className="contact-icon"><Mail size={20} style={{ color: 'var(--blue-4)' }} /></div>
                  <div>
                    <div className="contact-label">Email</div>
                    <div className="contact-value">{CV.email}</div>
                  </div>
                </a>
                <a href={`tel:${CV.phone}`} className="contact-card">
                  <div className="contact-icon"><Phone size={20} style={{ color: 'var(--blue-4)' }} /></div>
                  <div>
                    <div className="contact-label">Phone</div>
                    <div className="contact-value">{CV.phone}</div>
                  </div>
                </a>
                <a href={CV.linkedin} target="_blank" rel="noopener noreferrer" className="contact-card">
                  <div className="contact-icon"><span style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{logos.linkedin}</span></div>
                  <div>
                    <div className="contact-label">LinkedIn</div>
                    <div className="contact-value">Jeyarakavan Jeyakandan</div>
                  </div>
                </a>
                <a href={CV.github} target="_blank" rel="noopener noreferrer" className="contact-card">
                  <div className="contact-icon"><span style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{logos.github}</span></div>
                  <div>
                    <div className="contact-label">GitHub</div>
                    <div className="contact-value">github.com/Jeyarakavan</div>
                  </div>
                </a>
                <div className="contact-card" style={{ cursor: 'default' }}>
                  <div className="contact-icon"><MapPin size={20} style={{ color: 'var(--blue-4)' }} /></div>
                  <div>
                    <div className="contact-label">Location</div>
                    <div className="contact-value">{CV.location}</div>
                  </div>
                </div>
              </div>
            </div>

            <form className="contact-form reveal" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input className="form-input" type="text" required
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" required
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input className="form-input" type="text" required
                  value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-textarea" required
                  value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
              </div>
              {formStatus === 'success' && (
                <div className="form-success">✅ Message sent! I'll get back to you soon.</div>
              )}
              {formStatus === 'error' && (
                <div className="form-error">❌ Something went wrong. Please email me directly at {CONTACT_EMAIL}.</div>
              )}
              <button type="submit" className="btn-send" disabled={formLoading}>
                <Send size={15} /> {formLoading ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div>
              <div className="footer-name">Jeyarakavan Jeyakandan</div>
              <div className="footer-tagline">Full Stack Developer · AI/ML Enthusiast</div>
            </div>
          </div>

          <nav className="footer-nav" aria-label="Footer navigation">
            <div className="footer-nav-title">Navigation</div>
            <ul className="footer-nav-links">
              {navItems.map(item => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-nav-mobile">
            <select className="footer-nav-select" onChange={e => { if (e.target.value) { window.location.hash = e.target.value; e.target.value = ''; } }} defaultValue="">
              <option value="" disabled>Navigate to…</option>
              {navItems.map(item => (
                <option key={item.id} value={`#${item.id}`}>{item.label}</option>
              ))}
            </select>
          </div>

          <div className="footer-socials-col">
            <div className="footer-nav-title">Connect</div>
            <div className="footer-socials">
              <a href={CV.linkedin} target="_blank" rel="noopener noreferrer" className="footer-social">
                <span style={{ width: 16, height: 16, display: 'inline-flex' }}>{logos.linkedin}</span> LinkedIn
              </a>
              <a href={CV.github} target="_blank" rel="noopener noreferrer" className="footer-social">
                <span style={{ width: 16, height: 16, display: 'inline-flex' }}>{logos.github}</span> GitHub
              </a>
              <a href={`mailto:${CV.email}`} className="footer-social">
                <Mail size={14} /> Email
              </a>
              <a href={CV_PDF} download="Jeyarakavan_SoftwareEngineering_CV.pdf" className="footer-social">
                <Download size={14} /> CV
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2026 Jeyarakavan Jeyakandan · Full Stack Developer · Jaffna, Sri Lanka</p>
        </div>
      </footer>

      <a
        href="#contact"
        className="floating-contact-btn"
        aria-label="Get in touch"
        title="Get in touch"
      >
        <MessageSquare size={20} />
      </a>

      {showBackToTop && (
        <button
          type="button"
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <ChevronDown size={18} style={{ transform: 'rotate(180deg)' }} />
        </button>
      )}
    </>
  );
}
