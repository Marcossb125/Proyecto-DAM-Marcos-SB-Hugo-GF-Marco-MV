-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-04-2026 a las 19:49:40
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `agenda`
--
CREATE DATABASE IF NOT EXISTS `agenda` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `agenda`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contactos`
--

CREATE TABLE `contactos` (
  `codcontacto` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `email` varchar(20) NOT NULL,
  `telefono` varchar(11) NOT NULL,
  `codusuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `contactos`
--

INSERT INTO `contactos` (`codcontacto`, `nombre`, `email`, `telefono`, `codusuario`) VALUES
(1, 'Juan Perez', 'aaa@gmail.com', '678000000', 1),
(2, 'Rosa Lopez', 'bbb@gmail.com', '678111111', 1),
(3, 'Pepe Fernandez', 'bbb@gmail.com', '678111111', 2),
(4, 'montse', 'montse@lalsalslasla', '00000000001', 4),
(5, 'a', 'a@a', '111', 4),
(6, 'montse', 'evqe@keomvo', '00000000001', 3),
(7, 'qewveqv', 'evewv@evnqe', '1923914', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Codigo` int(11) NOT NULL,
  `Nombre` varchar(20) NOT NULL,
  `Clave` varchar(20) NOT NULL,
  `Rol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`Codigo`, `Nombre`, `Clave`, `Rol`) VALUES
(1, 'luis', 'luis', 0),
(2, 'maria', 'maria', 0),
(3, 'paco', 'paco', 0),
(4, 'pedro', 'pedro', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `contactos`
--
ALTER TABLE `contactos`
  ADD PRIMARY KEY (`codcontacto`),
  ADD KEY `codusuario` (`codusuario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Codigo`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `contactos`
--
ALTER TABLE `contactos`
  ADD CONSTRAINT `contactos_ibfk_1` FOREIGN KEY (`codusuario`) REFERENCES `usuarios` (`Codigo`) ON DELETE CASCADE;
--
-- Base de datos: `bdsimon`
--
CREATE DATABASE IF NOT EXISTS `bdsimon` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `bdsimon`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugadas`
--

CREATE TABLE `jugadas` (
  `codjugada` int(11) NOT NULL,
  `codigousu` int(11) NOT NULL,
  `acierto` tinyint(1) NOT NULL,
  `numcirculos` int(11) DEFAULT NULL,
  `numcolores` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `jugadas`
--

INSERT INTO `jugadas` (`codjugada`, `codigousu`, `acierto`, `numcirculos`, `numcolores`) VALUES
(1, 1, 1, NULL, NULL),
(2, 1, 1, NULL, NULL),
(3, 2, 1, NULL, NULL),
(4, 2, 0, NULL, NULL),
(5, 2, 1, NULL, NULL),
(6, 3, 1, NULL, NULL),
(7, 4, 1, NULL, NULL),
(8, 4, 0, NULL, NULL),
(9, 4, 0, NULL, NULL),
(10, 4, 0, NULL, NULL),
(11, 4, 0, NULL, NULL),
(12, 4, 0, NULL, NULL),
(13, 4, 0, NULL, NULL),
(14, 2, 0, NULL, NULL),
(15, 4, 1, NULL, NULL),
(16, 4, 1, NULL, NULL),
(17, 4, 1, NULL, NULL),
(18, 4, 1, NULL, NULL),
(19, 4, 1, NULL, NULL),
(20, 4, 1, NULL, NULL),
(21, 4, 1, NULL, NULL),
(22, 4, 1, NULL, NULL),
(23, 4, 1, NULL, NULL),
(24, 4, 1, NULL, NULL),
(25, 4, 1, NULL, NULL),
(26, 4, 1, NULL, NULL),
(27, 4, 1, NULL, NULL),
(28, 4, 1, NULL, NULL),
(29, 4, 1, NULL, NULL),
(30, 4, 1, NULL, NULL),
(31, 4, 1, NULL, NULL),
(32, 4, 1, NULL, NULL),
(33, 4, 1, NULL, NULL),
(34, 4, 1, NULL, NULL),
(35, 4, 1, NULL, NULL),
(36, 4, 1, NULL, NULL),
(37, 4, 1, NULL, NULL),
(38, 4, 1, NULL, NULL),
(39, 3, 1, NULL, NULL),
(40, 2, 0, NULL, NULL),
(41, 1, 1, NULL, NULL),
(42, 1, 1, NULL, NULL),
(43, 3, 1, NULL, NULL),
(44, 1, 1, NULL, NULL),
(52, 21, 1, NULL, NULL),
(53, 21, 1, NULL, NULL),
(54, 21, 1, NULL, NULL),
(55, 21, 1, NULL, NULL),
(69, 1, 0, 4, 8),
(70, 1, 0, 8, 4),
(71, 1, 0, 4, 4),
(72, 1, 0, 4, 4),
(73, 3, 0, 4, 4),
(74, 3, 0, 4, 4),
(75, 3, 0, 4, 4),
(76, 21, 0, 4, 4),
(77, 21, 0, 4, 4),
(78, 21, 0, 4, 4),
(79, 21, 0, 4, 4),
(80, 1, 0, 4, 4),
(81, 1, 0, 4, 4),
(82, 1, 0, 4, 8),
(83, 21, 0, 4, 4),
(84, 21, 0, 4, 8),
(85, 21, 0, 4, 8),
(86, 21, 0, 4, 8),
(87, 21, 0, 4, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Codigo` int(11) NOT NULL,
  `Nombre` varchar(20) NOT NULL,
  `Clave` varchar(20) NOT NULL,
  `Rol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`Codigo`, `Nombre`, `Clave`, `Rol`) VALUES
(1, 'ana', 'ana', 0),
(2, 'maria', 'maria', 0),
(3, 'paco', 'paco', 0),
(4, 'pedro', 'pedro', 0),
(21, 'nerea', '123', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `jugadas`
--
ALTER TABLE `jugadas`
  ADD PRIMARY KEY (`codjugada`),
  ADD KEY `fk_jugadas_usuarios` (`codigousu`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Codigo`),
  ADD UNIQUE KEY `Nombre` (`Nombre`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `jugadas`
--
ALTER TABLE `jugadas`
  MODIFY `codjugada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `Codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `jugadas`
--
ALTER TABLE `jugadas`
  ADD CONSTRAINT `fk_jugadas_usuarios` FOREIGN KEY (`codigousu`) REFERENCES `usuarios` (`Codigo`) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- Base de datos: `cartas`
--
CREATE DATABASE IF NOT EXISTS `cartas` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `cartas`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugador`
--

CREATE TABLE `jugador` (
  `nombre` varchar(25) NOT NULL,
  `login` varchar(15) NOT NULL,
  `clave` varchar(40) NOT NULL,
  `puntos` int(11) NOT NULL DEFAULT 0,
  `extra` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `jugador`
--

INSERT INTO `jugador` (`nombre`, `login`, `clave`, `puntos`, `extra`) VALUES
('Benjamin', 'Benja', '123', 0, 0),
('Guille', 'guillermo', '123', 0, 0),
('Irene Adler', 'IreneAdler', '123', 0, 0),
('Luison', 'Luison', '123', -2, 23),
('Luisa', 'mluisaoa', '123', 0, 0),
('Victor Rubio', 'victorun', '123', -1, 51),
('Yolanda Iglesias', 'yolandais', '123', 6, 111);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `jugador`
--
ALTER TABLE `jugador`
  ADD PRIMARY KEY (`login`);
--
-- Base de datos: `convergence`
--
CREATE DATABASE IF NOT EXISTS `convergence` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `convergence`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `participantes`
--

CREATE TABLE `participantes` (
  `Id` int(11) NOT NULL,
  `partida_Id` int(11) NOT NULL,
  `Usuario_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partidas`
--

CREATE TABLE `partidas` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Jugadores_actuales` int(11) NOT NULL DEFAULT 1,
  `Jugadores_limite` int(11) NOT NULL DEFAULT 2,
  `Rondas` int(11) NOT NULL DEFAULT 0,
  `Estado` varchar(100) NOT NULL DEFAULT '"En curso"',
  `Fase` int(11) NOT NULL DEFAULT 0,
  `Host_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `partidas`
--

INSERT INTO `partidas` (`Id`, `Nombre`, `Jugadores_actuales`, `Jugadores_limite`, `Rondas`, `Estado`, `Fase`, `Host_id`) VALUES
(4, 'ccc', 1, 2, 0, 'En curso', 0, 16),
(6, 'PENE', 1, 2, 0, 'En curso', 0, 16),
(7, 'HugoGuapo', 1, 2, 0, 'En curso', 0, 15),
(8, 'Ppepe', 1, 2, 0, 'En curso', 0, 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Id` int(11) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Nickname` varchar(100) NOT NULL,
  `Bandera` int(11) DEFAULT NULL,
  `Faccion` varchar(100) DEFAULT NULL,
  `General_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`Id`, `Password`, `Email`, `Nickname`, `Bandera`, `Faccion`, `General_id`) VALUES
(15, '$2a$10$IndELOzUpDMu4hgTnsYgb./F4W8HU0fIVrDiedAbLNiwl009RTIJi', 'leyreaper35@gmail.com', 'RedReaper3', NULL, NULL, NULL),
(16, '$2a$10$vDIW0s.cx4YEfKfXgBYufuJ4ZEudlz/4J9Q9IGIRNkHhEY7Cefn7O', 'hugogarciafuillerat@gmail.com', 'hugo', NULL, NULL, NULL),
(17, '$2a$10$iC7wMhicVByy5cmdod7C5eWzXZopRDiG/670pxBX.E5s1BWPzTwum', 'Rodolfus@gmail.com', 'Rodolfus', NULL, NULL, NULL),
(18, '$2a$10$/8dcH7VrLBwZzmjii3TSAey1XGa78nDcMyg9DN/A7CLIGBosxSXtG', 'jhfhhfjd@gmail.com', 'Quart', NULL, NULL, NULL),
(19, '$2a$10$tVwAu9fzByJAwAgOlWdjd.kWikonawrPYWpa/4RUelkR7w5uZs0M6', 'elPresiEsMuySexy@gmail.com', 'Bombardino Presidino', NULL, NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `participantes`
--
ALTER TABLE `participantes`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `partidas`
--
ALTER TABLE `partidas`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `usuarios_unique` (`Email`),
  ADD UNIQUE KEY `Usuarios_Nickname_unique` (`Nickname`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `participantes`
--
ALTER TABLE `participantes`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `partidas`
--
ALTER TABLE `partidas`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- Base de datos: `jeroglifico`
--
CREATE DATABASE IF NOT EXISTS `jeroglifico` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `jeroglifico`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugador`
--

CREATE TABLE `jugador` (
  `nombre` varchar(25) NOT NULL,
  `login` varchar(15) NOT NULL,
  `clave` varchar(40) NOT NULL,
  `puntos` int(11) NOT NULL DEFAULT 0,
  `extra` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `jugador`
--

INSERT INTO `jugador` (`nombre`, `login`, `clave`, `puntos`, `extra`) VALUES
('Benjamin', 'Benja', '123', 57, 0),
('Juan Diego', 'diego', '123', 152, 0),
('Dioni', 'Dioni', '123', 131, 0),
('Guille', 'guillermo', '123', 23, 0),
('Irene Adler', 'IreneAdler', '123', 119, 0),
('Luis Lestón', 'leston', '123', 148, 0),
('Lourdes', 'Lourdes', '123', 139, 0),
('Luison', 'Luison', '123', 124, 0),
('Miguel', 'miguel', '123', 143, 0),
('Luisa', 'mluisaoa', '123', 0, 0),
('Olga', 'olga', '123', 130, 0),
('Victor Rubio', 'victorun', '123', 54, 0),
('Yolanda Iglesias', 'yolandais', '123', 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas`
--

CREATE TABLE `respuestas` (
  `fecha` date NOT NULL,
  `login` varchar(15) CHARACTER SET latin1 COLLATE latin1_spanish_ci NOT NULL,
  `hora` time NOT NULL,
  `respuesta` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `respuestas`
--

INSERT INTO `respuestas` (`fecha`, `login`, `hora`, `respuesta`) VALUES
('2022-05-03', 'Diego', '10:10:45', 'A Béjar'),
('2022-05-03', 'Dioni', '16:52:22', 'A Béjar'),
('2022-05-03', 'guillermo', '10:17:48', 'a bejar'),
('2022-05-03', 'IreneAdler', '10:12:31', 'a Bejar'),
('2022-05-03', 'leston', '10:45:05', 'A Béjar'),
('2022-05-03', 'Lourdes', '14:16:00', 'A Bejar'),
('2022-05-03', 'Luison', '12:31:20', 'A Bejar'),
('2022-05-03', 'miguel', '17:25:41', 'a bejar'),
('2022-05-03', 'olga', '10:12:19', 'A bejar'),
('2022-05-03', 'victorun', '09:56:51', 'a Bejar'),
('2022-05-04', '', '23:09:36', '...áteme, Rosa'),
('2022-05-04', 'diego', '10:17:21', 'áteme'),
('2022-05-04', 'Dioni', '11:47:32', 'Áteme'),
('2022-05-04', 'IreneAdler', '23:29:45', '¡áteme!'),
('2022-05-04', 'leston', '23:11:55', '...áteme'),
('2022-05-04', 'miguel', '15:05:02', 'áteme Rosa'),
('2022-05-04', 'olga', '12:54:22', 'áteme'),
('2022-05-05', 'Diego', '09:59:58', 'Cené migas.'),
('2022-05-05', 'Dioni', '17:50:38', '...cené migas'),
('2022-05-05', 'IreneAdler', '23:07:19', 'cene migas'),
('2022-05-05', 'leston', '15:13:26', '...cené migas'),
('2022-05-05', 'Lourdes', '21:08:10', '...cené migas'),
('2022-05-05', 'Luison', '23:06:03', 'Cene migas'),
('2022-05-05', 'miguel', '15:04:19', 'cené migas'),
('2022-05-05', 'victorun', '10:44:56', '...cené migas.'),
('2022-05-06', 'diego', '09:58:02', 'A sus tareas'),
('2022-05-06', 'Dioni', '14:11:47', 'A sus tareas'),
('2022-05-06', 'IreneAdler', '18:39:00', 'a sus tareas'),
('2022-05-06', 'leston', '13:52:52', 'A sus tareas'),
('2022-05-06', 'miguel', '14:38:35', 'a sus tareas'),
('2022-05-09', 'Diego', '10:36:23', 'No, Joaquín cenó'),
('2022-05-09', 'Dioni', '12:00:26', 'No, Joaquín cenó'),
('2022-05-09', 'IreneAdler', '19:35:13', 'no, Joaquin ceno'),
('2022-05-09', 'leston', '16:41:08', 'No, Joaquín cenó'),
('2022-05-09', 'Lourdes', '18:16:23', 'No, Joaquín cenó'),
('2022-05-09', 'Luison', '10:20:23', 'No, Joaquin ceno'),
('2022-05-09', 'miguel', '13:05:10', 'no, joaquin cenó'),
('2022-05-09', 'olga', '22:51:41', 'No, Joaquin ceno'),
('2022-05-09', 'victorun', '13:54:29', 'No, Joaquín cenó.'),
('2022-05-10', 'Diego', '12:15:57', 'Meteoro'),
('2022-05-10', 'Dioni', '22:49:25', 'Meteoro'),
('2022-05-10', 'IreneAdler', '12:16:29', 'meteoro'),
('2022-05-10', 'leston', '14:07:18', 'Meteoro'),
('2022-05-10', 'Lourdes', '18:31:20', 'Meteoro'),
('2022-05-10', 'Luison', '22:56:03', 'Meteoro'),
('2022-05-10', 'miguel', '11:12:40', 'meteoro'),
('2022-05-10', 'olga', '14:06:09', 'meteoro'),
('2022-05-10', 'victorun', '16:56:27', 'Aurora'),
('2022-05-11', 'Diego', '08:44:16', 'Se sentó, nene.'),
('2022-05-11', 'Dioni', '10:50:23', 'Se sentó nene'),
('2022-05-11', 'IreneAdler', '22:53:20', 'se sentó, nene'),
('2022-05-11', 'leston', '22:47:51', 'Se sentó, nene'),
('2022-05-11', 'Lourdes', '11:13:49', 'Se sentó, nene'),
('2022-05-11', 'Luison', '23:30:10', 'Se sento nene'),
('2022-05-11', 'miguel', '10:36:39', 'se sentó, nene'),
('2022-05-11', 'olga', '23:43:39', 'Se sentó, nene'),
('2022-05-12', 'diego', '11:10:50', 'Ténsala'),
('2022-05-12', 'Dioni', '11:11:17', 'Ténsala'),
('2022-05-12', 'IreneAdler', '11:28:31', 'tensala'),
('2022-05-12', 'leston', '11:56:16', 'Ténsala'),
('2022-05-12', 'Lourdes', '13:51:02', 'Ténsala'),
('2022-05-12', 'Luison', '12:55:50', 'Tensala'),
('2022-05-12', 'miguel', '11:38:01', 'ténsala'),
('2022-05-12', 'olga', '12:48:56', 'Ténsala'),
('2022-05-12', 'victorun', '10:33:55', 'Ténsala.'),
('2022-05-13', 'Diego', '09:39:17', 'Al armiño'),
('2022-05-13', 'Dioni', '11:04:25', 'Al armiño'),
('2022-05-13', 'IreneAdler', '09:39:32', 'al armiño'),
('2022-05-13', 'leston', '14:43:57', 'Al armiño'),
('2022-05-13', 'Lourdes', '10:54:05', 'Al armiño'),
('2022-05-13', 'Luison', '11:57:21', 'Al armiño'),
('2022-05-13', 'miguel', '12:49:08', 'al armiño'),
('2022-05-13', 'olga', '12:29:54', 'al armiño'),
('2022-05-13', 'victorun', '09:34:31', 'Al armiño.'),
('2022-05-16', 'diego', '09:56:27', 'Me lo notaba'),
('2022-05-16', 'Dioni', '17:38:07', '...me lo notaba'),
('2022-05-16', 'IreneAdler', '10:16:58', 'me lo notaba'),
('2022-05-16', 'leston', '14:34:11', 'Me lo notaba'),
('2022-05-16', 'Lourdes', '11:02:37', '...me lo notaba'),
('2022-05-16', 'Luison', '21:06:47', 'Me lo notaba'),
('2022-05-16', 'miguel', '17:56:07', 'me lo notaba'),
('2022-05-16', 'olga', '23:18:48', 'me lo notaba'),
('2022-05-16', 'victorun', '10:11:43', 'me lo notaba'),
('2022-05-17', 'Diego', '08:32:59', '...ya ni llamas'),
('2022-05-17', 'Dioni', '23:05:07', '...ya ni llamas'),
('2022-05-17', 'IreneAdler', '09:06:28', 'ya ni llamas'),
('2022-05-17', 'leston', '15:54:42', '...ya ni llamas'),
('2022-05-17', 'Lourdes', '09:00:25', '...ya ni llamas'),
('2022-05-17', 'miguel', '12:32:49', 'ya ni llamas'),
('2022-05-17', 'olga', '22:27:19', 'ya ni llamas'),
('2022-05-17', 'victorun', '15:26:29', 'ya ni llamas.'),
('2022-05-18', 'diego', '12:31:35', 'Acá, sí'),
('2022-05-18', 'Dioni', '12:25:48', 'Acá si'),
('2022-05-18', 'IreneAdler', '19:08:00', 'acá si'),
('2022-05-18', 'leston', '19:31:09', 'Acá, sí'),
('2022-05-18', 'Lourdes', '11:28:44', 'Acá si'),
('2022-05-18', 'Luison', '21:12:46', 'Aca sí'),
('2022-05-18', 'miguel', '23:41:45', 'aquí hebra'),
('2022-05-18', 'olga', '23:02:47', 'acá sí'),
('2022-05-18', 'victorun', '13:08:03', 'Está aparte.'),
('2022-05-19', 'Diego', '10:36:44', 'Al de Amalia'),
('2022-05-19', 'Dioni', '12:09:49', 'Al de Amalia'),
('2022-05-19', 'IreneAdler', '11:04:42', 'al de Amalia'),
('2022-05-19', 'leston', '14:13:27', 'Al de Amalia'),
('2022-05-19', 'Lourdes', '14:20:43', 'Al de Amalia'),
('2022-05-19', 'Luison', '22:58:09', 'Al de Amalia'),
('2022-05-19', 'miguel', '13:12:04', 'al de amalia'),
('2022-05-19', 'olga', '12:33:49', 'Al de Amalia'),
('2022-05-20', 'Diego', '13:22:10', 'Cena nada más.'),
('2022-05-20', 'Dioni', '13:32:33', 'La cena nada más'),
('2022-05-20', 'IreneAdler', '23:05:09', 'cena nada mas'),
('2022-05-20', 'leston', '23:38:52', 'La cena nada mas'),
('2022-05-20', 'Lourdes', '22:12:16', 'Cena nada mas'),
('2022-05-20', 'Luison', '18:56:09', 'Cena nada más'),
('2022-05-20', 'miguel', '15:05:56', 'cena, nadamas'),
('2022-05-20', 'olga', '23:55:21', 'conceda mas'),
('2022-05-23', 'diego', '21:26:58', 'Cesó Gabriel'),
('2022-05-23', 'IreneAdler', '13:29:30', 'ceso Gabriel'),
('2022-05-23', 'leston', '22:08:25', 'Cesó Gabriel'),
('2022-05-23', 'Lourdes', '19:30:41', 'Cesó Gabriel'),
('2022-05-23', 'Luison', '14:53:30', 'Ceso Gabriel'),
('2022-05-23', 'miguel', '22:32:36', 'ceso Gabriel'),
('2022-05-24', 'Diego', '08:38:20', 'En la planta novena'),
('2022-05-24', 'Dioni', '12:01:49', 'En la planta novena'),
('2022-05-24', 'IreneAdler', '08:49:12', 'en la planta novena'),
('2022-05-24', 'leston', '15:34:12', 'En la planta novena'),
('2022-05-24', 'Lourdes', '12:23:41', 'En la planta novena'),
('2022-05-24', 'Luison', '09:31:42', 'En la planta novena'),
('2022-05-24', 'miguel', '10:18:01', 'en la planta novena'),
('2022-05-24', 'olga', '19:43:36', 'En la planta novena'),
('2022-05-24', 'victorun', '17:14:23', 'en mi planta novena'),
('2022-05-25', 'Diego', '08:47:31', 'Enfoca más'),
('2022-05-25', 'Dioni', '11:26:07', 'Enfoca más'),
('2022-05-25', 'IreneAdler', '08:49:10', 'enfoca mas'),
('2022-05-25', 'leston', '16:26:31', '...enfoca más'),
('2022-05-25', 'Lourdes', '10:09:21', '...enfoca más'),
('2022-05-25', 'Luison', '11:56:55', 'Enfoca más'),
('2022-05-25', 'miguel', '13:21:59', 'enfoca mas'),
('2022-05-25', 'olga', '09:13:11', 'enfoca más'),
('2022-05-25', 'victorun', '09:00:07', 'en foca más'),
('2022-05-26', 'Diego', '12:03:45', 'Es emigrante'),
('2022-05-26', 'Dioni', '12:07:41', 'es emigrante'),
('2022-05-26', 'IreneAdler', '18:45:13', 'es emigrante'),
('2022-05-26', 'leston', '15:05:17', 'Es emigrante'),
('2022-05-26', 'Lourdes', '12:52:38', 'Es emigrante'),
('2022-05-26', 'miguel', '12:12:04', 'es emigrante'),
('2022-05-26', 'olga', '12:15:20', 'es emigrante'),
('2022-05-26', 'victorun', '13:21:58', 'es emigrante'),
('2022-05-27', 'diego', '10:07:04', '...ven, te la da'),
('2022-05-27', 'leston', '22:58:50', '...ven, te la da'),
('2022-05-27', 'Lourdes', '18:17:36', '...vi tela de cuadros'),
('2022-05-27', 'Luison', '21:34:26', 'Ve la tela'),
('2022-05-27', 'olga', '22:52:28', 'ven te la da'),
('2022-05-30', 'diego', '08:18:10', '...me soné'),
('2022-05-30', 'Dioni', '11:01:31', '...me soné'),
('2022-05-30', 'leston', '15:09:33', '...me soné'),
('2022-05-30', 'Lourdes', '13:27:35', '...me soné'),
('2022-05-30', 'Luison', '22:23:32', 'Me soné'),
('2022-05-30', 'miguel', '13:05:26', 'mesoné'),
('2022-05-30', 'olga', '20:22:22', 'me soné'),
('2022-05-30', 'victorun', '09:37:14', 'me soné.'),
('2022-05-31', 'Diego', '14:19:48', 'Sí, enseñala, Darío'),
('2022-05-31', 'Dioni', '14:01:46', 'Si, enséñala rápido'),
('2022-05-31', 'leston', '22:06:31', 'Sí, envía'),
('2022-05-31', 'Lourdes', '20:07:30', 'Si enséñala Darío'),
('2022-05-31', 'Luison', '11:45:38', 'Si enséñala, Dario'),
('2022-05-31', 'miguel', '18:09:54', 'sí, enseñala Darío'),
('2022-05-31', 'victorun', '20:58:03', 'enseñala sí, enagua.'),
('2022-06-01', 'diego', '09:17:51', 'Respira, Lola'),
('2022-06-01', 'Dioni', '10:42:14', 'Respira, Lola'),
('2022-06-01', 'IreneAdler', '09:18:17', 'respira, Lola'),
('2022-06-01', 'leston', '22:16:59', 'Respira Lola'),
('2022-06-01', 'Lourdes', '12:27:50', 'Respira Lola'),
('2022-06-01', 'Luison', '23:07:56', 'Respira lola'),
('2022-06-01', 'miguel', '12:55:22', 'respira Lola'),
('2022-06-01', 'olga', '12:44:50', 'Respira Lola'),
('2022-06-01', 'victorun', '20:09:33', '¡Respira Lola!.'),
('2022-06-02', 'Diego', '12:46:22', 'En ese la citó'),
('2022-06-02', 'Dioni', '22:48:01', 'La citó en ese'),
('2022-06-02', 'IreneAdler', '14:13:06', 'la citó en ese'),
('2022-06-02', 'leston', '16:40:41', 'En ese la citó'),
('2022-06-02', 'Lourdes', '20:08:44', 'La citó en ese'),
('2022-06-02', 'Luison', '22:33:43', 'En ese, la citó'),
('2022-06-02', 'miguel', '19:55:29', 'la citó en ese'),
('2022-06-02', 'olga', '19:39:40', 'En ese la citó'),
('2022-06-03', 'diego', '10:06:35', 'En un sobreático'),
('2022-06-03', 'Dioni', '22:04:51', 'En el sobreático'),
('2022-06-03', 'IreneAdler', '13:48:02', 'en un sobreatico'),
('2022-06-03', 'leston', '15:11:44', 'En el sobreático'),
('2022-06-03', 'Lourdes', '13:43:15', 'En el sobreático'),
('2022-06-03', 'miguel', '16:23:54', 'en el sobreatico'),
('2022-06-03', 'olga', '23:57:10', 'en el sobreatico'),
('2022-06-06', 'diego', '13:58:00', 'Están desencajados'),
('2022-06-06', 'Dioni', '15:10:24', 'Están desencajados'),
('2022-06-06', 'IreneAdler', '14:54:50', 'estan desencajados'),
('2022-06-06', 'leston', '13:58:34', 'Están desencajados'),
('2022-06-06', 'Lourdes', '16:03:19', 'Desencajados'),
('2022-06-06', 'Luison', '14:45:17', 'Están desencajados'),
('2022-06-06', 'miguel', '14:50:52', 'están desencajados'),
('2022-06-06', 'olga', '23:59:52', 'estan desencajados'),
('2022-06-06', 'victorun', '09:53:59', 'están desencajados'),
('2024-02-16', 'Diego', '11:34:24', 'Sonada'),
('2024-02-16', 'leston', '12:11:03', 'Que sonada'),
('2024-02-16', 'miguel', '12:13:31', 'Que sonada'),
('2024-02-16', 'olga', '23:57:38', 'Que sonada'),
('2025-12-04', 'yolandais', '10:50:40', 'hola');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solucion`
--

CREATE TABLE `solucion` (
  `fecha` date NOT NULL,
  `solucion` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `solucion`
--

INSERT INTO `solucion` (`fecha`, `solucion`) VALUES
('2022-05-03', 'A Béjar'),
('2022-05-04', '...áteme'),
('2022-05-05', '...cené migas'),
('2022-05-06', 'A sus tareas'),
('2022-05-09', 'No, Joaquín cenó'),
('2022-05-10', 'Meteoro'),
('2022-05-11', 'Se sentó, nene'),
('2022-05-12', 'Ténsala'),
('2022-05-13', 'Al armiño'),
('2022-05-16', '...me lo notaba'),
('2022-05-17', '...ya ni llamas'),
('2022-05-18', 'Acá, sí'),
('2022-05-19', 'Al de Amalia'),
('2022-05-20', 'Cena, nada mas'),
('2022-05-23', 'Cesó Gabriel'),
('2022-05-24', 'En la planta novena'),
('2022-05-25', '...enfoca más'),
('2022-05-26', 'Es emigrante'),
('2022-05-27', '...ven, te la da'),
('2022-05-30', '...me soné'),
('2022-05-31', 'Sí enséñala, Darío'),
('2022-06-01', '¡Respira, Lola!'),
('2024-02-16', 'Que sonada'),
('2024-02-17', 'El una'),
('2024-02-18', 'Llave inglesa');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `jugador`
--
ALTER TABLE `jugador`
  ADD PRIMARY KEY (`login`);

--
-- Indices de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD PRIMARY KEY (`fecha`,`login`);

--
-- Indices de la tabla `solucion`
--
ALTER TABLE `solucion`
  ADD PRIMARY KEY (`fecha`);
--
-- Base de datos: `masqueperros-bd`
--
CREATE DATABASE IF NOT EXISTS `masqueperros-bd` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `masqueperros-bd`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `blog`
--

CREATE TABLE `blog` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `contenido` text NOT NULL,
  `categoria` enum('adopcion','nutricion','salud','entrenamiento','bienestar') DEFAULT NULL,
  `autor_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas_veterinarias`
--

CREATE TABLE `citas_veterinarias` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `perro_id` int(11) NOT NULL,
  `veterinario_id` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `estado` enum('pendiente','confirmada','cancelada') NOT NULL DEFAULT 'pendiente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `citas_veterinarias`
--

INSERT INTO `citas_veterinarias` (`id`, `usuario_id`, `perro_id`, `veterinario_id`, `fecha`, `motivo`, `estado`, `created_at`, `updated_at`) VALUES
(5, 9, 8, 11, '2026-11-11 10:00:00', 'aahdu', 'pendiente', '2026-04-16 08:12:27', '2026-04-16 08:12:27'),
(6, 9, 8, 10, '2026-04-05 10:00:00', 'eeee', 'pendiente', '2026-04-16 08:12:52', '2026-04-16 08:12:52'),
(7, 9, 8, 11, '2026-12-26 10:00:00', 'atyenwnwnw', 'pendiente', '2026-04-16 08:13:05', '2026-04-16 08:13:05'),
(8, 9, 8, 12, '2026-04-16 13:21:17', 'si', 'confirmada', '2026-04-16 11:21:52', '2026-04-16 11:21:52'),
(9, 9, 8, 12, '2026-04-18 13:21:54', 'mañana', 'pendiente', '2026-04-16 11:22:10', '2026-04-16 11:22:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_medico`
--

CREATE TABLE `historial_medico` (
  `id` int(11) NOT NULL,
  `perro_id` int(11) NOT NULL,
  `veterinario_id` int(11) NOT NULL,
  `cita_id` int(11) DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `diagnostico` text NOT NULL,
  `tratamiento` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_medico`
--

INSERT INTO `historial_medico` (`id`, `perro_id`, `veterinario_id`, `cita_id`, `fecha`, `diagnostico`, `tratamiento`, `created_at`, `updated_at`) VALUES
(1, 8, 12, 6, '2026-04-16 13:38:07', 'prueba', 'prueba', '2026-04-16 11:38:31', '2026-04-16 11:38:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perros`
--

CREATE TABLE `perros` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `raza` varchar(100) NOT NULL,
  `edad` int(11) NOT NULL,
  `edad_meses` int(11) NOT NULL DEFAULT 0,
  `peso` decimal(5,2) NOT NULL,
  `sexo` enum('macho','hembra') NOT NULL,
  `size` enum('small','medium','large') NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('disponible','adoptado','en_proceso') NOT NULL DEFAULT 'disponible',
  `foto` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `perros`
--

INSERT INTO `perros` (`id`, `nombre`, `raza`, `edad`, `edad_meses`, `peso`, `sexo`, `size`, `descripcion`, `estado`, `foto`, `created_at`, `updated_at`) VALUES
(1, 'simba', 'border collie', 3, 0, 21.00, 'macho', 'medium', 'perro que esta loco', 'adoptado', 'assets/perros/simba.jpg', '2026-04-08 07:38:39', '2026-04-21 06:59:07'),
(3, 'nala', 'rottweiler', 1, 0, 12.00, 'hembra', 'large', 'pruebas', 'adoptado', 'assets/perros/nala.jpg', '2026-04-08 07:39:23', '2026-04-27 10:34:04'),
(4, 'gaston', 'pug', 5, 0, 6.00, 'macho', 'small', 'ttnetntene', 'adoptado', 'assets/perros/gaston.jpg', '2026-04-08 10:12:31', '2026-04-27 10:34:04'),
(5, 'osti', 'cocker spaniel', 4, 0, 10.00, 'macho', 'medium', '', 'disponible', 'assets/perros/osti.jpg', '2026-04-08 11:33:47', '2026-04-22 08:47:09'),
(6, 'bimba', 'caniche toy', 7, 0, 8.00, 'hembra', 'small', 'perra tranquila', 'adoptado', 'assets/perros/bimba.jpg', '2026-04-09 06:51:21', '2026-04-20 11:19:24'),
(7, 'rafa', 'Labrador Retriever', 9, 0, 22.00, 'hembra', 'large', NULL, 'disponible', 'assets/perros/rafa.jpg\r\n', '2026-04-10 06:43:44', '2026-04-10 06:43:44'),
(8, 'gala', 'shih Tzu', 5, 0, 5.00, 'hembra', 'small', 'Fea hermana de jagger', 'adoptado', 'assets/perros/gala.jpg', '2026-04-10 06:50:28', '2026-04-21 10:14:10'),
(9, 'Jagger', 'shih Tzu', 12, 0, 7.00, 'macho', 'small', 'Feo hermano de gala', 'adoptado', 'assets/perros/jagger.jpg', '2026-04-20 09:56:38', '2026-04-21 10:14:01'),
(10, 'Bruno', 'teckel', 4, 0, 5.00, 'macho', 'small', NULL, 'disponible', 'assets/perros/bruno.jpg', '2026-04-21 06:48:45', '2026-04-21 10:14:48'),
(11, 'Carlota', 'Caniche gigante', 5, 0, 20.00, 'hembra', 'large', NULL, 'disponible', 'assets/perros/carlota.jpg', '2026-04-21 06:49:53', '2026-04-21 06:49:53'),
(12, 'Gus', 'Perro de agua español', 4, 0, 36.00, 'macho', 'large', NULL, 'disponible', 'assets/perros/gus.jpg', '2026-04-21 06:50:44', '2026-04-21 06:50:44'),
(13, 'Kira', 'Border collie', 7, 0, 20.00, 'hembra', 'medium', 'Madre de Simba', 'disponible', 'assets/perros/kira.jpg', '2026-04-21 06:51:40', '2026-04-21 06:57:21'),
(14, 'Nino', 'Border collie', 5, 0, 22.00, 'macho', 'medium', 'Padre de Simba', 'disponible', 'assets/perros/nino.jpg', '2026-04-21 06:52:10', '2026-04-22 09:00:50'),
(15, 'Lolo', 'Mestizo', 5, 0, 13.00, 'macho', 'small', NULL, 'disponible', 'assets/perros/lolo.jpg', '2026-04-21 06:52:48', '2026-04-21 06:52:48'),
(16, 'Peks', 'Setter inglés', 2, 0, 15.00, 'hembra', 'medium', NULL, 'disponible', 'assets/perros/peks.jpg', '2026-04-21 06:54:27', '2026-04-21 06:54:27'),
(17, 'Rosita', 'Mestizo', 4, 0, 12.00, 'hembra', 'medium', NULL, 'disponible', 'assets/perros/rosita.jpg', '2026-04-21 06:55:09', '2026-04-22 09:00:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`, `descripcion`) VALUES
(1, 'admin', NULL),
(2, 'usuario', NULL),
(3, 'veterinario', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguimiento_postadopcion`
--

CREATE TABLE `seguimiento_postadopcion` (
  `id` int(11) NOT NULL,
  `solicitud_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `perro_id` int(11) NOT NULL,
  `nota` text NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `seguimiento_postadopcion`
--

INSERT INTO `seguimiento_postadopcion` (`id`, `solicitud_id`, `usuario_id`, `perro_id`, `nota`, `fecha`, `created_at`, `updated_at`) VALUES
(1, 14, 9, 4, 'Mi perro es feo no me gusta, lo quiero devolver', '2026-04-27 02:00:00', '2026-04-27 10:43:07', '2026-04-27 10:43:07'),
(2, 13, 9, 3, 'Va bien', '2026-04-27 02:00:00', '2026-04-27 10:43:30', '2026-04-27 10:43:30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_adopcion`
--

CREATE TABLE `solicitudes_adopcion` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `perro_id` int(11) NOT NULL,
  `estado` enum('pendiente','aceptada','rechazada') NOT NULL DEFAULT 'pendiente',
  `mensaje` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes_adopcion`
--

INSERT INTO `solicitudes_adopcion` (`id`, `usuario_id`, `perro_id`, `estado`, `mensaje`, `created_at`, `updated_at`) VALUES
(9, 8, 8, 'aceptada', 'Hola, me gustaría adoptar este perro', '2026-04-21 09:58:33', '2026-04-21 10:14:10'),
(10, 8, 9, 'aceptada', 'Hola, me gustaría adoptar este perro', '2026-04-21 09:58:36', '2026-04-21 10:14:01'),
(11, 8, 10, 'rechazada', 'Hola, me gustaría adoptar este perro', '2026-04-21 10:14:40', '2026-04-21 10:14:48'),
(12, 8, 3, 'rechazada', 'Hola, me gustaría adoptar este perro', '2026-04-21 10:24:27', '2026-04-22 09:03:00'),
(13, 9, 3, 'aceptada', 'Hola, me gustaría adoptar este perro', '2026-04-27 10:32:37', '2026-04-27 10:34:04'),
(14, 9, 4, 'aceptada', 'Hola, me gustaría adoptar este perro', '2026-04-27 10:32:38', '2026-04-27 10:34:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `rol_id` int(11) NOT NULL DEFAULT 2,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellidos`, `email`, `password`, `telefono`, `foto`, `rol_id`, `created_at`, `updated_at`) VALUES
(8, 'sari', 'su', 'sari@sara.com', '$2b$12$R4R5lWnF/FrsZyc7BkdjhO2aX3tgXQsgcL8iqLhXDsC.hmLYeWirq', '000000000', NULL, 1, '2026-04-08 07:44:22', '2026-04-09 07:43:18'),
(9, 'tusi', 'tusi', 'tusi@tusi.com', '$2b$12$IKbLgd.kML.qVtRlvgvuR.xk6TrasyjavGuESSLtuDZD6ahnILuR.', '111111111', 'https://res.cloudinary.com/dagbmes4o/image/upload/v1777531557/masqueperros/avatars/a8cng9m9umj4gfjlkdbv.jpg', 2, '2026-04-09 07:13:11', '2026-04-30 06:45:57'),
(10, 'Pepe', 'Pepito', 'pepe@pepe.com', 'Pepe123', '111111111', NULL, 3, '2026-04-14 07:18:18', '2026-04-14 07:18:18'),
(11, 'Juan', 'Juan', 'juan@juan.com', 'Juan123', '123123123', NULL, 3, '2026-04-14 09:08:40', '2026-04-14 09:08:40'),
(12, 'Vet', 'Vet', 'vet@vet.com', '$2b$12$ZkwTwRq9OWDEOPeLwjnA4OnyvqbpbmTaAIX3imHhWsw3cPd9Bpm.a', '109284279', 'https://res.cloudinary.com/dagbmes4o/image/upload/v1777535613/masqueperros/avatars/kydc3pnai8fq4fdghiom.jpg', 3, '2026-04-16 08:16:34', '2026-04-30 07:53:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vacunas`
--

CREATE TABLE `vacunas` (
  `id` int(11) NOT NULL,
  `perro_id` int(11) NOT NULL,
  `veterinario_id` int(11) NOT NULL,
  `cita_id` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `fecha` date NOT NULL,
  `dosis` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vacunas`
--

INSERT INTO `vacunas` (`id`, `perro_id`, `veterinario_id`, `cita_id`, `nombre`, `fecha`, `dosis`, `created_at`, `updated_at`) VALUES
(1, 8, 12, 8, 'Gala', '2026-04-16', 'Rabia', '2026-04-17 07:42:59', '2026-04-17 07:42:59'),
(2, 8, 12, NULL, 'Inicial', '2026-04-17', '1ml', '2026-04-17 08:13:39', '2026-04-17 08:13:39');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `blog`
--
ALTER TABLE `blog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_blog_autor` (`autor_id`);

--
-- Indices de la tabla `citas_veterinarias`
--
ALTER TABLE `citas_veterinarias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_citas_usuario` (`usuario_id`),
  ADD KEY `fk_citas_perro` (`perro_id`),
  ADD KEY `fk_citas_veterinario` (`veterinario_id`);

--
-- Indices de la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_historial_perro` (`perro_id`),
  ADD KEY `fk_historial_veterinario` (`veterinario_id`),
  ADD KEY `fk_historial_cita` (`cita_id`);

--
-- Indices de la tabla `perros`
--
ALTER TABLE `perros`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_roles_nombre` (`nombre`);

--
-- Indices de la tabla `seguimiento_postadopcion`
--
ALTER TABLE `seguimiento_postadopcion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_seguimiento_solicitud` (`solicitud_id`),
  ADD KEY `fk_seguimiento_usuario` (`usuario_id`),
  ADD KEY `fk_seguimiento_perro` (`perro_id`);

--
-- Indices de la tabla `solicitudes_adopcion`
--
ALTER TABLE `solicitudes_adopcion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_solicitudes_usuario` (`usuario_id`),
  ADD KEY `fk_solicitudes_perro` (`perro_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_usuarios_email` (`email`),
  ADD KEY `fk_usuarios_rol` (`rol_id`);

--
-- Indices de la tabla `vacunas`
--
ALTER TABLE `vacunas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_vacunas_perro` (`perro_id`),
  ADD KEY `fk_vacunas_veterinario` (`veterinario_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `blog`
--
ALTER TABLE `blog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `citas_veterinarias`
--
ALTER TABLE `citas_veterinarias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `perros`
--
ALTER TABLE `perros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `seguimiento_postadopcion`
--
ALTER TABLE `seguimiento_postadopcion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `solicitudes_adopcion`
--
ALTER TABLE `solicitudes_adopcion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `vacunas`
--
ALTER TABLE `vacunas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `blog`
--
ALTER TABLE `blog`
  ADD CONSTRAINT `fk_blog_autor` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `citas_veterinarias`
--
ALTER TABLE `citas_veterinarias`
  ADD CONSTRAINT `fk_citas_perro` FOREIGN KEY (`perro_id`) REFERENCES `perros` (`id`),
  ADD CONSTRAINT `fk_citas_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_citas_veterinario` FOREIGN KEY (`veterinario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
  ADD CONSTRAINT `fk_historial_cita` FOREIGN KEY (`cita_id`) REFERENCES `citas_veterinarias` (`id`),
  ADD CONSTRAINT `fk_historial_perro` FOREIGN KEY (`perro_id`) REFERENCES `perros` (`id`),
  ADD CONSTRAINT `fk_historial_veterinario` FOREIGN KEY (`veterinario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `seguimiento_postadopcion`
--
ALTER TABLE `seguimiento_postadopcion`
  ADD CONSTRAINT `fk_seguimiento_perro` FOREIGN KEY (`perro_id`) REFERENCES `perros` (`id`),
  ADD CONSTRAINT `fk_seguimiento_solicitud` FOREIGN KEY (`solicitud_id`) REFERENCES `solicitudes_adopcion` (`id`),
  ADD CONSTRAINT `fk_seguimiento_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `solicitudes_adopcion`
--
ALTER TABLE `solicitudes_adopcion`
  ADD CONSTRAINT `fk_solicitudes_perro` FOREIGN KEY (`perro_id`) REFERENCES `perros` (`id`),
  ADD CONSTRAINT `fk_solicitudes_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`);

--
-- Filtros para la tabla `vacunas`
--
ALTER TABLE `vacunas`
  ADD CONSTRAINT `fk_vacunas_perro` FOREIGN KEY (`perro_id`) REFERENCES `perros` (`id`),
  ADD CONSTRAINT `fk_vacunas_veterinario` FOREIGN KEY (`veterinario_id`) REFERENCES `usuarios` (`id`);
--
-- Base de datos: `oposicion`
--
CREATE DATABASE IF NOT EXISTS `oposicion` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `oposicion`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumno`
--

CREATE TABLE `alumno` (
  `dniA` varchar(9) NOT NULL,
  `nombreA` varchar(20) DEFAULT NULL,
  `apellido1A` varchar(20) DEFAULT NULL,
  `apellido2A` varchar(20) DEFAULT NULL,
  `direccionA` varchar(30) DEFAULT NULL,
  `sexoA` varchar(1) DEFAULT NULL,
  `fechanacA` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `alumno`
--

INSERT INTO `alumno` (`dniA`, `nombreA`, `apellido1A`, `apellido2A`, `direccionA`, `sexoA`, `fechanacA`) VALUES
('1111', 'Carlos', 'Puerta', 'Perez', 'c/ P?, 21', 'V', '0000-00-00'),
('2222', 'Luisa', 'Sanchez', 'Donoso', 'c/ Sierpes, 1', 'M', '0000-00-00'),
('3333', 'Eva', 'Ramos', 'Prieto', 'c/ Rueda, 31', 'M', '0000-00-00'),
('4444', 'Luis', 'Paez', 'Garcia', 'c/ Martin Villa, 21', 'V', '0000-00-00'),
('5555', 'Ana', 'Padilla', 'Torres', 'c/ Tetuan, 2', 'M', '0000-00-00'),
('6666', 'Lola', 'Flores', 'Ruiz', 'c/ Real, 14', 'M', '0000-00-00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `curso`
--

CREATE TABLE `curso` (
  `codigocurso` varchar(5) NOT NULL,
  `nombrecurso` varchar(40) DEFAULT NULL,
  `maxalumnos` int(4) DEFAULT NULL,
  `fechaini` date DEFAULT NULL,
  `fechafin` date DEFAULT NULL,
  `numhoras` int(4) DEFAULT NULL,
  `profesor` varchar(9) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `curso`
--

INSERT INTO `curso` (`codigocurso`, `nombrecurso`, `maxalumnos`, `fechaini`, `fechafin`, `numhoras`, `profesor`) VALUES
('0001', 'Función Publica', 120, '2003-05-09', '2030-06-09', 400, '444'),
('0002', 'Los chiquillos', 180, '2013-05-09', '2030-08-09', 600, '222'),
('0003', 'Puentes Atirantados', 20, '2003-12-08', '2030-06-09', 800, '111'),
('0004', 'Vida familiar de los presos', 120, '2003-05-09', '2030-06-09', 400, '222'),
('0005', 'La Constitucion', 230, '2003-05-09', '2030-06-09', 100, '444'),
('0006', 'Programación Visual para todos', 80, '2003-09-09', '2030-09-09', 30, '555');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursomanual`
--

CREATE TABLE `cursomanual` (
  `codcurso` varchar(5) NOT NULL,
  `referencia` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `cursomanual`
--

INSERT INTO `cursomanual` (`codcurso`, `referencia`) VALUES
('0001', 'M001'),
('0001', 'M004'),
('0003', 'M005'),
('0004', 'M001'),
('0004', 'M003'),
('0005', 'M001'),
('0005', 'M004'),
('0006', 'M002'),
('0006', 'M006');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursooposicion`
--

CREATE TABLE `cursooposicion` (
  `codcurso` varchar(5) NOT NULL,
  `codoposicion` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `cursooposicion`
--

INSERT INTO `cursooposicion` (`codcurso`, `codoposicion`) VALUES
('0001', 'C-502'),
('0001', 'C-512'),
('0001', 'C-522'),
('0001', 'C-532'),
('0001', 'C-542'),
('0001', 'C-552'),
('0002', 'C-502'),
('0003', 'C-552'),
('0004', 'C-512'),
('0005', 'C-502'),
('0005', 'C-512'),
('0005', 'C-522'),
('0005', 'C-532'),
('0005', 'C-542'),
('0006', 'C-522');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `manual`
--

CREATE TABLE `manual` (
  `referencia` varchar(6) NOT NULL,
  `titulo` varchar(40) DEFAULT NULL,
  `autor` varchar(30) DEFAULT NULL,
  `fechapub` date DEFAULT NULL,
  `precio` int(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `manual`
--

INSERT INTO `manual` (`referencia`, `titulo`, `autor`, `fechapub`, `precio`) VALUES
('M001', 'El Derecho', 'Garzón', '2012-05-06', 23),
('M002', 'C y PHP: lo mismo es', 'Joseph Sunday', '2012-09-07', 12),
('M003', 'Los delincuentes y sus sentimientos', 'El Chori', '2012-07-08', 16),
('M004', 'Las Administraciones Publicas', 'Ruiz', '2012-07-07', 8),
('M005', 'Estatica y Dinamica', 'Calatrava', '2002-05-05', 43),
('M006', 'Problemas irresolubles en JSP', 'John Tagua', '2007-07-07', 25);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `matricula`
--

CREATE TABLE `matricula` (
  `dnialumno` varchar(9) NOT NULL,
  `codcurso` varchar(5) NOT NULL,
  `pruebaA` int(2) DEFAULT NULL,
  `pruebaB` int(2) DEFAULT NULL,
  `tipo` varchar(7) DEFAULT NULL,
  `inscripcion` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `matricula`
--

INSERT INTO `matricula` (`dnialumno`, `codcurso`, `pruebaA`, `pruebaB`, `tipo`, `inscripcion`) VALUES
('1111', '0001', 12, 8, 'Oficial', '2012-06-06'),
('1111', '0005', 18, 5, 'Oficial', '2012-07-06'),
('2222', '0003', 25, 28, 'Libre', '2012-08-06'),
('2222', '0005', 32, 28, 'Libre', '2012-09-06'),
('3333', '0006', 12, 15, 'Oficial', '2012-10-06'),
('4444', '0006', 18, 35, 'Oficial', '2012-11-06'),
('5555', '0001', 11, 38, 'Oficial', '2012-03-07'),
('5555', '0002', 32, 38, 'Libre', '2012-01-07'),
('5555', '0003', 11, 18, 'Oficial', '2012-02-07'),
('5555', '0005', 42, 48, 'Oficial', '2012-04-07'),
('5555', '0006', 20, 48, 'Oficial', '2012-12-06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `oposicion`
--

CREATE TABLE `oposicion` (
  `codigo` varchar(6) NOT NULL,
  `nombre` varchar(40) DEFAULT NULL,
  `fechaexamen` date DEFAULT NULL,
  `organismo` varchar(30) DEFAULT NULL,
  `plazas` int(4) DEFAULT NULL,
  `categoria` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `oposicion`
--

INSERT INTO `oposicion` (`codigo`, `nombre`, `fechaexamen`, `organismo`, `plazas`, `categoria`) VALUES
('C-502', 'Maestros de Primaria', '2027-05-10', 'Consejeria Educacion', 1220, 'B'),
('C-512', 'Funcionario de Prisiones', '2020-06-10', 'Consejeria Justicia', 120, 'C'),
('C-522', 'Profesores de Informática', '2027-06-09', 'Consejeria Educacion', 12, 'A'),
('C-532', 'Jardineros del Estado', '2027-05-10', 'Ministerio Medio Ambiente', 10, 'D'),
('C-542', 'Administrativos', '2027-05-10', 'Ayuntamiento DH', 12, 'C'),
('C-552', 'Ingenieros del Ejercito', '2027-09-10', 'Ministerio Defensa', 120, 'A');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesor`
--

CREATE TABLE `profesor` (
  `dniP` varchar(9) NOT NULL,
  `nombreP` varchar(20) DEFAULT NULL,
  `apellido1P` varchar(20) DEFAULT NULL,
  `apellido2P` varchar(20) DEFAULT NULL,
  `direccionP` varchar(30) DEFAULT NULL,
  `tituloP` varchar(30) DEFAULT NULL,
  `sueldoP` int(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `profesor`
--

INSERT INTO `profesor` (`dniP`, `nombreP`, `apellido1P`, `apellido2P`, `direccionP`, `tituloP`, `sueldoP`) VALUES
('111', 'Manuel', 'Lopez', 'Garcia', 'c/ Albeniz,12', 'Ingeniero de Caminos', 2000),
('222', 'Luis', 'Perez', 'Sanchez', 'c/ Huelva, 1', 'Licenciado en Psicologia', 1400),
('333', 'Ana', 'Garcia', 'Lopez', 'c/ Sevilla,2', 'Ingeniero de Caminos', 2200),
('444', 'Eva', 'Parra', 'Ruiz', 'c/ Astoria,7', 'Licenciado en Derecho', 1200),
('555', 'Federico', 'Flores', 'Alba', 'c/ Tarifa, 1', 'Ingeniero Inform?tico', 2500),
('666', 'Alberto', 'Moreno', 'Rodriguez', 'c/ Parra, 2', 'Ingeniero de Caminos', 2100);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alumno`
--
ALTER TABLE `alumno`
  ADD PRIMARY KEY (`dniA`);

--
-- Indices de la tabla `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`codigocurso`),
  ADD KEY `CUP_FK` (`profesor`);

--
-- Indices de la tabla `cursomanual`
--
ALTER TABLE `cursomanual`
  ADD PRIMARY KEY (`codcurso`,`referencia`),
  ADD KEY `CUM1_FK` (`referencia`);

--
-- Indices de la tabla `cursooposicion`
--
ALTER TABLE `cursooposicion`
  ADD PRIMARY KEY (`codcurso`,`codoposicion`),
  ADD KEY `COP2_FK` (`codoposicion`);

--
-- Indices de la tabla `manual`
--
ALTER TABLE `manual`
  ADD PRIMARY KEY (`referencia`);

--
-- Indices de la tabla `matricula`
--
ALTER TABLE `matricula`
  ADD PRIMARY KEY (`dnialumno`,`codcurso`),
  ADD KEY `MAC1_FK` (`codcurso`);

--
-- Indices de la tabla `oposicion`
--
ALTER TABLE `oposicion`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `profesor`
--
ALTER TABLE `profesor`
  ADD PRIMARY KEY (`dniP`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `curso`
--
ALTER TABLE `curso`
  ADD CONSTRAINT `CUP_FK` FOREIGN KEY (`profesor`) REFERENCES `profesor` (`dniP`) ON DELETE CASCADE;

--
-- Filtros para la tabla `cursomanual`
--
ALTER TABLE `cursomanual`
  ADD CONSTRAINT `CUC2_FK` FOREIGN KEY (`codcurso`) REFERENCES `curso` (`codigocurso`) ON DELETE CASCADE,
  ADD CONSTRAINT `CUM1_FK` FOREIGN KEY (`referencia`) REFERENCES `manual` (`referencia`) ON DELETE CASCADE;

--
-- Filtros para la tabla `cursooposicion`
--
ALTER TABLE `cursooposicion`
  ADD CONSTRAINT `COP1_FK` FOREIGN KEY (`codcurso`) REFERENCES `curso` (`codigocurso`) ON DELETE CASCADE,
  ADD CONSTRAINT `COP2_FK` FOREIGN KEY (`codoposicion`) REFERENCES `oposicion` (`codigo`) ON DELETE CASCADE;

--
-- Filtros para la tabla `matricula`
--
ALTER TABLE `matricula`
  ADD CONSTRAINT `MAA2_FK` FOREIGN KEY (`dnialumno`) REFERENCES `alumno` (`dniA`) ON DELETE CASCADE,
  ADD CONSTRAINT `MAC1_FK` FOREIGN KEY (`codcurso`) REFERENCES `curso` (`codigocurso`) ON DELETE CASCADE;
--
-- Base de datos: `phpmyadmin`
--
CREATE DATABASE IF NOT EXISTS `phpmyadmin` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `phpmyadmin`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__bookmark`
--

CREATE TABLE `pma__bookmark` (
  `id` int(10) UNSIGNED NOT NULL,
  `dbase` varchar(255) NOT NULL DEFAULT '',
  `user` varchar(255) NOT NULL DEFAULT '',
  `label` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `query` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Bookmarks';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__central_columns`
--

CREATE TABLE `pma__central_columns` (
  `db_name` varchar(64) NOT NULL,
  `col_name` varchar(64) NOT NULL,
  `col_type` varchar(64) NOT NULL,
  `col_length` text DEFAULT NULL,
  `col_collation` varchar(64) NOT NULL,
  `col_isNull` tinyint(1) NOT NULL,
  `col_extra` varchar(255) DEFAULT '',
  `col_default` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Central list of columns';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__column_info`
--

CREATE TABLE `pma__column_info` (
  `id` int(5) UNSIGNED NOT NULL,
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `column_name` varchar(64) NOT NULL DEFAULT '',
  `comment` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `mimetype` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `transformation` varchar(255) NOT NULL DEFAULT '',
  `transformation_options` varchar(255) NOT NULL DEFAULT '',
  `input_transformation` varchar(255) NOT NULL DEFAULT '',
  `input_transformation_options` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Column information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__designer_settings`
--

CREATE TABLE `pma__designer_settings` (
  `username` varchar(64) NOT NULL,
  `settings_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Settings related to Designer';

--
-- Volcado de datos para la tabla `pma__designer_settings`
--

INSERT INTO `pma__designer_settings` (`username`, `settings_data`) VALUES
('root', '{\"relation_lines\":\"true\",\"snap_to_grid\":\"off\",\"angular_direct\":\"direct\"}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__export_templates`
--

CREATE TABLE `pma__export_templates` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL,
  `export_type` varchar(10) NOT NULL,
  `template_name` varchar(64) NOT NULL,
  `template_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved export templates';

--
-- Volcado de datos para la tabla `pma__export_templates`
--

INSERT INTO `pma__export_templates` (`id`, `username`, `export_type`, `template_name`, `template_data`) VALUES
(1, 'root', 'table', 'Convergence', '{\"quick_or_custom\":\"quick\",\"what\":\"sql\",\"allrows\":\"1\",\"aliases_new\":\"\",\"output_format\":\"sendit\",\"filename_template\":\"@TABLE@\",\"remember_template\":\"on\",\"charset\":\"utf-8\",\"compression\":\"none\",\"maxsize\":\"\",\"codegen_structure_or_data\":\"data\",\"codegen_format\":\"0\",\"csv_separator\":\",\",\"csv_enclosed\":\"\\\"\",\"csv_escaped\":\"\\\"\",\"csv_terminated\":\"AUTO\",\"csv_null\":\"NULL\",\"csv_columns\":\"something\",\"csv_structure_or_data\":\"data\",\"excel_null\":\"NULL\",\"excel_columns\":\"something\",\"excel_edition\":\"win\",\"excel_structure_or_data\":\"data\",\"json_structure_or_data\":\"data\",\"json_unicode\":\"something\",\"latex_caption\":\"something\",\"latex_structure_or_data\":\"structure_and_data\",\"latex_structure_caption\":\"Estructura de la tabla @TABLE@\",\"latex_structure_continued_caption\":\"Estructura de la tabla @TABLE@ (continúa)\",\"latex_structure_label\":\"tab:@TABLE@-structure\",\"latex_relation\":\"something\",\"latex_comments\":\"something\",\"latex_mime\":\"something\",\"latex_columns\":\"something\",\"latex_data_caption\":\"Contenido de la tabla @TABLE@\",\"latex_data_continued_caption\":\"Contenido de la tabla @TABLE@ (continúa)\",\"latex_data_label\":\"tab:@TABLE@-data\",\"latex_null\":\"\\\\textit{NULL}\",\"mediawiki_structure_or_data\":\"data\",\"mediawiki_caption\":\"something\",\"mediawiki_headers\":\"something\",\"htmlword_structure_or_data\":\"structure_and_data\",\"htmlword_null\":\"NULL\",\"ods_null\":\"NULL\",\"ods_structure_or_data\":\"data\",\"odt_structure_or_data\":\"structure_and_data\",\"odt_relation\":\"something\",\"odt_comments\":\"something\",\"odt_mime\":\"something\",\"odt_columns\":\"something\",\"odt_null\":\"NULL\",\"pdf_report_title\":\"\",\"pdf_structure_or_data\":\"data\",\"phparray_structure_or_data\":\"data\",\"sql_include_comments\":\"something\",\"sql_header_comment\":\"\",\"sql_use_transaction\":\"something\",\"sql_compatibility\":\"NONE\",\"sql_structure_or_data\":\"structure_and_data\",\"sql_create_table\":\"something\",\"sql_auto_increment\":\"something\",\"sql_create_view\":\"something\",\"sql_create_trigger\":\"something\",\"sql_backquotes\":\"something\",\"sql_type\":\"INSERT\",\"sql_insert_syntax\":\"both\",\"sql_max_query_size\":\"50000\",\"sql_hex_for_binary\":\"something\",\"sql_utc_time\":\"something\",\"texytext_structure_or_data\":\"structure_and_data\",\"texytext_null\":\"NULL\",\"xml_structure_or_data\":\"data\",\"xml_export_events\":\"something\",\"xml_export_functions\":\"something\",\"xml_export_procedures\":\"something\",\"xml_export_tables\":\"something\",\"xml_export_triggers\":\"something\",\"xml_export_views\":\"something\",\"xml_export_contents\":\"something\",\"yaml_structure_or_data\":\"data\",\"\":null,\"lock_tables\":null,\"csv_removeCRLF\":null,\"excel_removeCRLF\":null,\"json_pretty_print\":null,\"htmlword_columns\":null,\"ods_columns\":null,\"sql_dates\":null,\"sql_relation\":null,\"sql_mime\":null,\"sql_disable_fk\":null,\"sql_views_as_tables\":null,\"sql_metadata\":null,\"sql_drop_table\":null,\"sql_if_not_exists\":null,\"sql_simple_view_export\":null,\"sql_view_current_user\":null,\"sql_or_replace_view\":null,\"sql_procedure_function\":null,\"sql_truncate\":null,\"sql_delayed\":null,\"sql_ignore\":null,\"texytext_columns\":null}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__favorite`
--

CREATE TABLE `pma__favorite` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Favorite tables';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__history`
--

CREATE TABLE `pma__history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db` varchar(64) NOT NULL DEFAULT '',
  `table` varchar(64) NOT NULL DEFAULT '',
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp(),
  `sqlquery` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='SQL history for phpMyAdmin';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__navigationhiding`
--

CREATE TABLE `pma__navigationhiding` (
  `username` varchar(64) NOT NULL,
  `item_name` varchar(64) NOT NULL,
  `item_type` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Hidden items of navigation tree';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__pdf_pages`
--

CREATE TABLE `pma__pdf_pages` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `page_nr` int(10) UNSIGNED NOT NULL,
  `page_descr` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='PDF relation pages for phpMyAdmin';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__recent`
--

CREATE TABLE `pma__recent` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Recently accessed tables';

--
-- Volcado de datos para la tabla `pma__recent`
--

INSERT INTO `pma__recent` (`username`, `tables`) VALUES
('root', '[{\"db\":\"convergence\",\"table\":\"partidas\"},{\"db\":\"convergence\",\"table\":\"usuarios\"},{\"db\":\"convergence\",\"table\":\"participantes\"},{\"db\":\"videoclub\",\"table\":\"users\"},{\"db\":\"masqueperros-bd\",\"table\":\"usuarios\"},{\"db\":\"videoclub\",\"table\":\"movies\"},{\"db\":\"tragaperra\",\"table\":\"jugadores\"},{\"db\":\"masqueperros-bd\",\"table\":\"perros\"},{\"db\":\"masqueperros-bd\",\"table\":\"citas_veterinarias\"},{\"db\":\"masqueperros-bd\",\"table\":\"solicitudes_adopcion\"}]');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__relation`
--

CREATE TABLE `pma__relation` (
  `master_db` varchar(64) NOT NULL DEFAULT '',
  `master_table` varchar(64) NOT NULL DEFAULT '',
  `master_field` varchar(64) NOT NULL DEFAULT '',
  `foreign_db` varchar(64) NOT NULL DEFAULT '',
  `foreign_table` varchar(64) NOT NULL DEFAULT '',
  `foreign_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Relation table';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__savedsearches`
--

CREATE TABLE `pma__savedsearches` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `search_name` varchar(64) NOT NULL DEFAULT '',
  `search_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved searches';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__table_coords`
--

CREATE TABLE `pma__table_coords` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `pdf_page_number` int(11) NOT NULL DEFAULT 0,
  `x` float UNSIGNED NOT NULL DEFAULT 0,
  `y` float UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table coordinates for phpMyAdmin PDF output';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__table_info`
--

CREATE TABLE `pma__table_info` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `display_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__table_uiprefs`
--

CREATE TABLE `pma__table_uiprefs` (
  `username` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `prefs` text NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Tables'' UI preferences';

--
-- Volcado de datos para la tabla `pma__table_uiprefs`
--

INSERT INTO `pma__table_uiprefs` (`username`, `db_name`, `table_name`, `prefs`, `last_update`) VALUES
('root', 'bdsimon', 'jugadas', '{\"sorted_col\":\"`jugadas`.`numcolores` ASC\"}', '2025-11-17 10:52:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__tracking`
--

CREATE TABLE `pma__tracking` (
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `version` int(10) UNSIGNED NOT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `schema_snapshot` text NOT NULL,
  `schema_sql` text DEFAULT NULL,
  `data_sql` longtext DEFAULT NULL,
  `tracking` set('UPDATE','REPLACE','INSERT','DELETE','TRUNCATE','CREATE DATABASE','ALTER DATABASE','DROP DATABASE','CREATE TABLE','ALTER TABLE','RENAME TABLE','DROP TABLE','CREATE INDEX','DROP INDEX','CREATE VIEW','ALTER VIEW','DROP VIEW') DEFAULT NULL,
  `tracking_active` int(1) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Database changes tracking for phpMyAdmin';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__userconfig`
--

CREATE TABLE `pma__userconfig` (
  `username` varchar(64) NOT NULL,
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `config_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User preferences storage for phpMyAdmin';

--
-- Volcado de datos para la tabla `pma__userconfig`
--

INSERT INTO `pma__userconfig` (`username`, `timevalue`, `config_data`) VALUES
('root', '2026-04-30 17:49:32', '{\"Console\\/Mode\":\"collapse\",\"lang\":\"es\"}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__usergroups`
--

CREATE TABLE `pma__usergroups` (
  `usergroup` varchar(64) NOT NULL,
  `tab` varchar(64) NOT NULL,
  `allowed` enum('Y','N') NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User groups with configured menu items';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__users`
--

CREATE TABLE `pma__users` (
  `username` varchar(64) NOT NULL,
  `usergroup` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Users and their assignments to user groups';

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pma__central_columns`
--
ALTER TABLE `pma__central_columns`
  ADD PRIMARY KEY (`db_name`,`col_name`);

--
-- Indices de la tabla `pma__column_info`
--
ALTER TABLE `pma__column_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `db_name` (`db_name`,`table_name`,`column_name`);

--
-- Indices de la tabla `pma__designer_settings`
--
ALTER TABLE `pma__designer_settings`
  ADD PRIMARY KEY (`username`);

--
-- Indices de la tabla `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_user_type_template` (`username`,`export_type`,`template_name`);

--
-- Indices de la tabla `pma__favorite`
--
ALTER TABLE `pma__favorite`
  ADD PRIMARY KEY (`username`);

--
-- Indices de la tabla `pma__history`
--
ALTER TABLE `pma__history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`,`db`,`table`,`timevalue`);

--
-- Indices de la tabla `pma__navigationhiding`
--
ALTER TABLE `pma__navigationhiding`
  ADD PRIMARY KEY (`username`,`item_name`,`item_type`,`db_name`,`table_name`);

--
-- Indices de la tabla `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  ADD PRIMARY KEY (`page_nr`),
  ADD KEY `db_name` (`db_name`);

--
-- Indices de la tabla `pma__recent`
--
ALTER TABLE `pma__recent`
  ADD PRIMARY KEY (`username`);

--
-- Indices de la tabla `pma__relation`
--
ALTER TABLE `pma__relation`
  ADD PRIMARY KEY (`master_db`,`master_table`,`master_field`),
  ADD KEY `foreign_field` (`foreign_db`,`foreign_table`);

--
-- Indices de la tabla `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_savedsearches_username_dbname` (`username`,`db_name`,`search_name`);

--
-- Indices de la tabla `pma__table_coords`
--
ALTER TABLE `pma__table_coords`
  ADD PRIMARY KEY (`db_name`,`table_name`,`pdf_page_number`);

--
-- Indices de la tabla `pma__table_info`
--
ALTER TABLE `pma__table_info`
  ADD PRIMARY KEY (`db_name`,`table_name`);

--
-- Indices de la tabla `pma__table_uiprefs`
--
ALTER TABLE `pma__table_uiprefs`
  ADD PRIMARY KEY (`username`,`db_name`,`table_name`);

--
-- Indices de la tabla `pma__tracking`
--
ALTER TABLE `pma__tracking`
  ADD PRIMARY KEY (`db_name`,`table_name`,`version`);

--
-- Indices de la tabla `pma__userconfig`
--
ALTER TABLE `pma__userconfig`
  ADD PRIMARY KEY (`username`);

--
-- Indices de la tabla `pma__usergroups`
--
ALTER TABLE `pma__usergroups`
  ADD PRIMARY KEY (`usergroup`,`tab`,`allowed`);

--
-- Indices de la tabla `pma__users`
--
ALTER TABLE `pma__users`
  ADD PRIMARY KEY (`username`,`usergroup`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pma__column_info`
--
ALTER TABLE `pma__column_info`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `pma__history`
--
ALTER TABLE `pma__history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  MODIFY `page_nr` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Base de datos: `test`
--
CREATE DATABASE IF NOT EXISTS `test` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `test`;
--
-- Base de datos: `tragaperra`
--
CREATE DATABASE IF NOT EXISTS `tragaperra` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `tragaperra`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugadores`
--

CREATE TABLE `jugadores` (
  `nombre` varchar(25) NOT NULL,
  `login` varchar(15) NOT NULL,
  `clave` varchar(40) NOT NULL,
  `puntos` int(11) DEFAULT 0,
  `extra` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `jugadores`
--

INSERT INTO `jugadores` (`nombre`, `login`, `clave`, `puntos`, `extra`) VALUES
('Benjamin', 'benjamin', '1234', 10, 0),
('Guillermo', 'guillermo', '1234', 0, 10),
('Irene', 'irene', '1234', 0, 0),
('Luis', 'luis', '1234', 55, 16),
('Yolanda', 'yolanda', '1234', 33, 25);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `jugadores`
--
ALTER TABLE `jugadores`
  ADD PRIMARY KEY (`login`);
--
-- Base de datos: `validacionbd`
--
CREATE DATABASE IF NOT EXISTS `validacionbd` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `validacionbd`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `clave` varchar(20) NOT NULL,
  `web` varchar(100) DEFAULT NULL,
  `comentario` text DEFAULT NULL,
  `genero` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`codigo`, `nombre`, `email`, `clave`, `web`, `comentario`, `genero`) VALUES
(3, 'pepe', 'neresk27@gmail.com', '$2y$10$INupx6Qbnm5T3', '', '', 'Femenino'),
(10, 'pepe', 'neresk27@gmail.com', '$2y$10$i.QRCZTaA.0QL', '', '', 'Masculino');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`codigo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- Base de datos: `videoclub`
--
CREATE DATABASE IF NOT EXISTS `videoclub` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `videoclub`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-a@a|::1', 'i:2;', 1777275977),
('laravel-cache-a@a|::1:timer', 'i:1777275977;', 1777275977),
('laravel-cache-admin@example.com|::1', 'i:3;', 1777538909),
('laravel-cache-admin@example.com|::1:timer', 'i:1777538909;', 1777538909);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_04_17_103229_create_movies_table', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movies`
--

CREATE TABLE `movies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `year` varchar(8) NOT NULL,
  `director` varchar(64) NOT NULL,
  `poster` varchar(255) NOT NULL,
  `rented` tinyint(1) NOT NULL DEFAULT 0,
  `synopsis` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `movies`
--

INSERT INTO `movies` (`id`, `title`, `year`, `director`, `poster`, `rented`, `synopsis`, `created_at`, `updated_at`) VALUES
(41, 'El padrino', '1972', 'Francis Ford Coppola', 'https://static.wikia.nocookie.net/doblaje/images/9/9a/Elpadrino.jpg/revision/latest?cb=20211023042804&path-prefix=es', 0, 'Don Vito Corleone (Marlon Brando) es el respetado y temido jefe de una de las cinco familias de la mafia de Nueva York. Tiene cuatro hijos: Connie (Talia Shire), el impulsivo Sonny (James Caan), el pusilánime Freddie (John Cazale) y Michael (Al Pacino), que no quiere saber nada de los negocios de su padre. Cuando Corleone, en contra de los consejos de \'Il consigliere\' Tom Hagen (Robert Duvall), se niega a intervenir en el negocio de las drogas, el jefe de otra banda ordena su asesinato. Empieza entonces una violenta y cruenta guerra entre las familias mafiosas.', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(42, 'El Padrino. Parte II', '1974', 'Francis Ford Coppola', 'https://pics.filmaffinity.com/the_godfather_part_ii-124238415-large.jpg', 0, 'Continuación de la historia de los Corleone por medio de dos historias paralelas: la elección de Michael Corleone como jefe de los negocios familiares y los orígenes del patriarca, el ya fallecido Don Vito, primero en Sicilia y luego en Estados Unidos, donde, empezando desde abajo, llegó a ser un poderosísimo jefe de la mafia de Nueva York.', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(43, 'La lista de Schindler', '1993', 'Steven Spielberg', 'https://m.media-amazon.com/images/M/MV5BZTkzMjIwOWUtYmRkZS00ZDdjLThiOTQtNjk4ZmM5NTY1YWI1XkEyXkFqcGc@._V1_.jpg', 0, 'Segunda Guerra Mundial (1939-1945). Oskar Schindler (Liam Neeson), un hombre de enorme astucia y talento para las relaciones públicas, organiza un ambicioso plan para ganarse la simpatía de los nazis. Después de la invasión de Polonia por los alemanes (1939), consigue, gracias a sus relaciones con los nazis, la propiedad de una fábrica de Cracovia. Allí emplea a cientos de operarios judíos, cuya explotación le hace prosperar rápidamente. Su gerente (Ben Kingsley), también judío, es el verdadero director en la sombra, pues Schindler carece completamente de conocimientos para dirigir una empresa.', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(44, 'Pulp Fiction', '1994', 'Quentin Tarantino', 'https://pics.filmaffinity.com/Pulp_Fiction-210382116-large.jpg', 1, 'Jules y Vincent, dos asesinos a sueldo con muy pocas luces, trabajan para Marsellus Wallace. Vincent le confiesa a Jules que Marsellus le ha pedido que cuide de Mia, su mujer. Jules le recomienda prudencia porque es muy peligroso sobrepasarse con la novia del jefe. Cuando llega la hora de trabajar, ambos deben ponerse manos a la obra. Su misión: recuperar un misterioso maletín. ', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(45, 'Cadena perpetua', '1994', 'Frank Darabont', 'https://m.media-amazon.com/images/I/71cyqt3GXYL._AC_UF894,1000_QL80_.jpg', 1, 'Acusado del asesinato de su mujer, Andrew Dufresne (Tim Robbins), tras ser condenado a cadena perpetua, es enviado a la cárcel de Shawshank. Con el paso de los años conseguirá ganarse la confianza del director del centro y el respeto de sus compañeros de prisión, especialmente de Red (Morgan Freeman), el jefe de la mafia de los sobornos.', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(46, 'El golpe', '1973', 'George Roy Hill', 'https://m.media-amazon.com/images/M/MV5BYjMxYWYzNTAtNjdjMC00YmJiLTljYWEtNjdkNmFjZWExZjJmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 0, 'Chicago, años treinta. Redford y Newman son dos timadores que deciden vengar la muerte de un viejo y querido colega, asesinado por orden de un poderoso gángster (Robert Shaw). Para ello urdirán un ingenioso y complicado plan con la ayuda de todos sus amigos y conocidos.', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(47, 'La vida es bella', '1997', 'Roberto Benigni', 'https://m.media-amazon.com/images/M/MV5BNTZhN2IwZWUtNTI2Yy00OWNjLWExZmYtOGMzN2M5NTE1MzM1XkEyXkFqcGc@._V1_.jpg', 1, 'En 1939, a punto de estallar la Segunda Guerra Mundial (1939-1945), el extravagante Guido llega a Arezzo (Toscana) con la intención de abrir una librería. Allí conoce a Dora y, a pesar de que es la prometida del fascista Ferruccio, se casa con ella y tiene un hijo. Al estallar la guerra, los tres son internados en un campo de exterminio, donde Guido hará lo imposible para hacer creer a su hijo que la terrible situación que están padeciendo es tan sólo un juego.', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(48, 'Uno de los nuestros', '1990', 'Martin Scorsese', 'https://pics.filmaffinity.com/goodfellas-343032101-large.jpg', 0, 'Henry Hill, hijo de padre irlandés y madre siciliana, vive en Brooklyn y se siente fascinado por la vida que llevan los gángsters de su barrio, donde la mayoría de los vecinos son inmigrantes. Paul Cicero, el patriarca de la familia Pauline, es el protector del barrio. A los trece años, Henry decide abandonar la escuela y entrar a formar parte de la organización mafiosa como chico de los recados; muy pronto se gana la confianza de sus jefes, gracias a lo cual irá subiendo de categoría. ', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(49, 'Alguien voló sobre el nido del cuco', '1975', 'Milos Forman', 'https://pics.filmaffinity.com/Alguien_volao_sobre_el_nido_del_cuco-669408644-large.jpg', 0, 'Randle McMurphy (Jack Nicholson), un hombre condenado por asalto, y un espíritu libre que vive contracorriente, es recluido en un hospital psiquiátrico. La inflexible disciplina del centro acentúa su contagiosa tendencia al desorden, que acabará desencadenando una guerra entre los pacientes y el personal de la clínica con la fría y severa enfermera Ratched (Louise Fletcher) a la cabeza. La suerte de cada paciente del pabellón está en juego.', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(50, 'American History X', '1998', 'Tony Kaye', 'https://m.media-amazon.com/images/M/MV5BMzhiOTQ0NDItOTg0Zi00OGVmLWE0OGEtMTI4NDM0NWMxZWU4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 0, 'Derek (Edward Norton), un joven \"skin head\" californiano de ideología neonazi, fue encarcelado por asesinar a un negro que pretendía robarle su furgoneta. Cuando sale de prisión y regresa a su barrio dispuesto a alejarse del mundo de la violencia, se encuentra con que su hermano pequeño (Edward Furlong), para quien Derek es el modelo a seguir, sigue el mismo camino que a él lo condujo a la cárcel.', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(51, 'Sin perdón', '1992', 'Clint Eastwood', 'https://m.media-amazon.com/images/M/MV5BMWYxODJjNzMtZWZmOS00ZDMwLTk1YjQtZjgzNjMyODBlNmNiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 0, 'William Munny (Clint Eastwood) es un pistolero retirado, viudo y padre de familia, que tiene dificultades económicas para sacar adelante a su hijos. Su única salida es hacer un último trabajo. En compañía de un viejo colega (Morgan Freeman) y de un joven inexperto (Jaimz Woolvett), Munny tendrá que matar a dos hombres que cortaron la cara a una prostituta.', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(52, 'El precio del poder', '1983', 'Brian De Palma', 'https://m.media-amazon.com/images/I/5102kpHGTLL._AC_UF894,1000_QL80_.jpg', 0, 'Tony Montana es un emigrante cubano frío y sanguinario que se instala en Miami con el propósito de convertirse en un gángster importante. Con la colaboración de su amigo Manny Rivera inicia una fulgurante carrera delictiva con el objetivo de acceder a la cúpula de una organización de narcos.', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(53, 'El pianista', '2002', 'Roman Polanski', 'https://es.web.img2.acsta.net/pictures/14/05/27/12/07/438875.jpg', 1, 'Wladyslaw Szpilman, un brillante pianista polaco de origen judío, vive con su familia en el ghetto de Varsovia. Cuando, en 1939, los alemanes invaden Polonia, consigue evitar la deportación gracias a la ayuda de algunos amigos. Pero tendrá que vivir escondido y completamente aislado durante mucho tiempo, y para sobrevivir tendrá que afrontar constantes peligros.', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(54, 'Seven', '1995', 'David Fincher', 'https://pics.filmaffinity.com/Seven-498520078-large.jpg', 1, 'El veterano teniente Somerset (Morgan Freeman), del departamento de homicidios, está a punto de jubilarse y ser reemplazado por el ambicioso e impulsivo detective David Mills (Brad Pitt). Ambos tendrán que colaborar en la resolución de una serie de asesinatos cometidos por un psicópata que toma como base la relación de los siete pecados capitales: gula, pereza, soberbia, avaricia, envidia, lujuria e ira. Los cuerpos de las víctimas, sobre los que el asesino se ensaña de manera impúdica, se convertirán para los policías en un enigma que les obligará a viajar al horror y la barbarie más absoluta.', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(55, 'El silencio de los corderos', '1991', 'Jonathan Demme', 'https://m.media-amazon.com/images/I/81uiWyjF0AL._AC_UF1000,1000_QL80_.jpg', 0, 'El FBI busca a \"Buffalo Bill\", un asesino en serie que mata a sus víctimas, todas adolescentes, después de prepararlas minuciosamente y arrancarles la piel. Para poder atraparlo recurren a Clarice Starling, una brillante licenciada universitaria, experta en conductas psicópatas, que aspira a formar parte del FBI. Siguiendo las instrucciones de su jefe, Jack Crawford, Clarice visita la cárcel de alta seguridad donde el gobierno mantiene encerrado a Hannibal Lecter, antiguo psicoanalista y asesino, dotado de una inteligencia superior a la normal. Su misión será intentar sacarle información sobre los patrones de conducta de \"Buffalo Bill\".', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(56, 'La naranja mecánica', '1971', 'Stanley Kubrick', 'https://m.media-amazon.com/images/M/MV5BYjFiN2E5N2ItZjc1Yy00MzZmLThmZGQtNGIyYjljMzk1NmU4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 0, 'Gran Bretaña, en un futuro indeterminado. Alex (Malcolm McDowell) es un joven muy agresivo que tiene dos pasiones: la violencia desaforada y Beethoven. Es el jefe de la banda de los drugos, que dan rienda suelta a sus instintos más salvajes apaleando, violando y aterrorizando a la población. Cuando esa escalada de terror llega hasta el asesinato, Alex es detenido y, en prisión, se someterá voluntariamente a una innovadora experiencia de reeducación que pretende anular drásticamente cualquier atisbo de conducta antisocial.', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(57, 'La chaqueta metálica', '1987', 'Stanley Kubrick', 'https://es.web.img3.acsta.net/medias/nmedia/18/90/15/35/20083253.jpg', 1, 'Un grupo de reclutas se prepara en Parish Island, centro de entrenamiento de la marina norteamericana. Allí está el sargento Hartman, duro e implacable, cuya única misión en la vida es endurecer el cuerpo y el alma de los novatos, para que puedan defenderse del enemigo. Pero no todos los jóvenes están preparados para soportar sus métodos. ', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(58, 'Blade Runner', '1982', 'Ridley Scott', 'https://pics.filmaffinity.com/Blade_Runner-421258957-large.jpg', 1, 'A principios del siglo XXI, la poderosa Tyrell Corporation creó, gracias a los avances de la ingeniería genética, un robot llamado Nexus 6, un ser virtualmente idéntico al hombre pero superior a él en fuerza y agilidad, al que se dio el nombre de Replicante. Estos robots trabajaban como esclavos en las colonias exteriores de la Tierra. Después de la sangrienta rebelión de un equipo de Nexus-6, los Replicantes fueron desterrados de la Tierra. Brigadas especiales de policía, los Blade Runners, tenían órdenes de matar a todos los que no hubieran acatado la condena. Pero a esto no se le llamaba ejecución, se le llamaba \"retiro\". ', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(59, 'Taxi Driver', '1976', 'Martin Scorsese', 'https://es.web.img2.acsta.net/medias/nmedia/18/74/28/34/20234753.jpg', 0, 'Para sobrellevar el insomnio crónico que sufre desde su regreso de Vietnam, Travis Bickle (Robert De Niro) trabaja como taxista nocturno en Nueva York. Es un hombre insociable que apenas tiene contacto con los demás, se pasa los días en el cine y vive prendado de Betsy (Cybill Shepherd), una atractiva rubia que trabaja como voluntaria en una campaña política. Pero lo que realmente obsesiona a Travis es comprobar cómo la violencia, la sordidez y la desolación dominan la ciudad. Y un día decide pasar a la acción.', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(60, 'El club de la lucha', '1999', 'David Fincher', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk5ECJX88UJn10cG6quPW8HRXPTXNHoxQ9-A&s', 1, 'Un joven hastiado de su gris y monótona vida lucha contra el insomnio. En un viaje en avión conoce a un carismático vendedor de jabón que sostiene una teoría muy particular: el perfeccionismo es cosa de gentes débiles; sólo la autodestrucción hace que la vida merezca la pena. Ambos deciden entonces fundar un club secreto de lucha, donde poder descargar sus frustaciones y su ira, que tendrá un éxito arrollador.', '2026-04-24 08:18:50', '2026-04-24 08:18:50'),
(62, 'Simba y Sari perdidos por el mundo', '1999', 'Sari', 'https://www.lanacion.com.ar/resizer/v2/el-encuentro-de-kingston-con-su-duena-5-anos-RWVFA5DSFFF5XEJE2KYDHMAFWU.png?auth=20f08ee0d6e8f62dfff70a49a9190538af9e0cf3cdb3f8e912f714498991ac8d&width=1200&height=800&quality=70&smart=true', 0, 'Sarita sara se va de viaje a Perú con su perro Simba y juntos hacen muchos amiguitos y se ponen a beber cervecitas.', '2026-04-27 06:11:48', '2026-04-27 06:33:19');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('IKVjGb1f4Rv9JK3WGh37E231BIwpEdfPXlJOQqxw', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiYkV5a2x3YXA2RHBWdmUzT2dsQjBhdWJjbVVvTDNoeDZRTkdSbkxiViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjQ6Imh0dHA6Ly9sb2NhbGhvc3QvRFdFUy9MQVJBVkVML01JVklERU9DTFVCL3B1YmxpYy9jYXRhbG9nL3Nob3cvNjIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6MzoidXJsIjthOjE6e3M6ODoiaW50ZW5kZWQiO3M6NDg6Imh0dHA6Ly9sb2NhbGhvc3QvRFdFUy9MQVJBVkVML01JVklERU9DTFVCL3B1YmxpYyI7fX0=', 1777278799),
('pNdJIy6wsNpIaGmx3yMbNul3FomJuvZ7mi0q6wxl', 5, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTo2OntzOjY6Il90b2tlbiI7czo0MDoiNk41OTNHTDM0QUtUdmU1TjdNb3FZdmxvUEFYQmt5TjFYVGc4WXdTcSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHA6Ly9sb2NhbGhvc3QvRFdFUy9MQVJBVkVML01JVklERU9DTFVCL3B1YmxpYy9jYXRhbG9nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjM6InVybCI7YTowOnt9czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6NTtzOjQ6ImF1dGgiO2E6MTp7czoyMToicGFzc3dvcmRfY29uZmlybWVkX2F0IjtpOjE3Nzc1MzkyMTQ7fX0=', 1777539214);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(3, 'Admin', 'admin@example.com', NULL, '$2y$12$Qe8o/jRTq7S2BMswH83ALuCQ6u8osBHBtKHID3Ko0fC/Orun6cgZm', NULL, '2026-04-24 08:18:51', '2026-04-24 08:18:51'),
(4, 'Nerea', 'nerea@example.com', NULL, '$2y$12$eEVo9aujub9G8fwVPZPT4.OKux6MmdUXCjed2wK4L/91NHR7MAUIm', NULL, '2026-04-24 08:18:51', '2026-04-24 08:18:51'),
(5, 'nerea', 'n@n.com', NULL, '$2y$12$RCC5aahZ3F4BUqaDdjZt.edjeIvfHglx1NXir/Jx5xEdKtQYrT/g.', NULL, '2026-04-30 06:48:04', '2026-04-30 06:48:04'),
(6, 'sara', 'sari@sara.com', NULL, '$2y$12$QqcT2DXLbSz4WZVsw7p/4uVdG2y2WgthEGvXsGZSnvuIuvgmfoZHu', NULL, '2026-04-30 06:51:42', '2026-04-30 06:51:42');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indices de la tabla `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indices de la tabla `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `movies`
--
ALTER TABLE `movies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
