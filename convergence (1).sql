-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-04-2026 a las 19:50:16
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
-- Base de datos: `convergence`
--

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
