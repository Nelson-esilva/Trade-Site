import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Visibility as ViewIcon,
  SwapHoriz as SwapIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ItemCard = ({ 
  item, 
  showOwner = true, 
  compact = false,
  onFavorite,
  onShare,
  onViewDetails,
  onMakeOffer,
}) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(item.isFavorite || false);

  const getCategoryLabel = (category) => {
    const categoryLabels = {
      'livros': 'Livros',
      'apostilas': 'Apostilas',
      'equipamentos': 'Equipamentos',
      'tecnologia': 'Tecnologia',
    };
    return categoryLabels[category] || category;
  };

  const getStatusInfo = (status) => {
    const statusInfo = {
      'disponivel': { label: 'Disponível', color: 'success' },
      'indisponível': { label: 'Indisponível', color: 'error' },
      'trocado': { label: 'Trocado', color: 'info' },
    };
    return statusInfo[status] || { label: status, color: 'default' };
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (onFavorite) {
      onFavorite(item.id, !isFavorite);
    }
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    if (onShare) {
      onShare(item);
    } else {
      // Implementação padrão de compartilhamento
      navigator.share?.({
        title: item.title,
        text: item.description,
        url: window.location.origin + `/item/${item.id}`,
      });
    }
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(item);
    } else {
      navigate(`/item/${item.id}`);
    }
  };

  const handleMakeOfferClick = (e) => {
    e.stopPropagation();
    if (onMakeOffer) {
      onMakeOffer(item);
    } else {
      navigate(`/item/${item.id}`);
    }
  };


  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
        position: 'relative',
      }}
      onClick={handleCardClick}
    >
      {/* Imagem do Item */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height={compact ? 120 : 160}
          image={item.image_url || '/api/placeholder/300/200'}
          alt={item.title}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        
        {/* Ações de Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          <Tooltip title="Favoritar">
            <IconButton
              size="small"
              onClick={handleFavoriteClick}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                width: 28,
                height: 28,
              }}
            >
              {isFavorite ? (
                <FavoriteIcon color="error" fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Compartilhar">
            <IconButton
              size="small"
              onClick={handleShareClick}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                width: 28,
                height: 28,
              }}
            >
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>

        </Box>

        {/* Badge de Categoria */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
          }}
        >
          <Chip
            label={getCategoryLabel(item.category)}
            size="small"
            color="primary"
            sx={{ backgroundColor: 'rgba(25, 118, 210, 0.9)' }}
          />
        </Box>

        {/* Badge de Ofertas */}
        {item.offerCount > 0 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
            }}
          >
            <Chip
              label={`${item.offerCount} ofertas`}
              size="small"
              color="secondary"
              sx={{ backgroundColor: 'rgba(220, 0, 78, 0.9)', color: 'white' }}
            />
          </Box>
        )}
      </Box>

      {/* Conteúdo do Card */}
      <CardContent sx={{ flexGrow: 1, pb: 1, pt: 1.5 }}>
        <Typography
          variant="subtitle2"
          component="h3"
          gutterBottom
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.2,
            minHeight: '2.4em',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          {item.title}
        </Typography>

        {/* Status e Estado */}
        <Box display="flex" gap={0.5} mb={1} flexWrap="wrap">
          {item.status && (
            <Chip
              label={getStatusInfo(item.status).label}
              size="small"
              variant="outlined"
              color={getStatusInfo(item.status).color}
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          )}
          {item.condition && (
            <Chip
              label={item.condition}
              size="small"
              variant="outlined"
              color="success"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          )}
        </Box>

        {/* Localização */}
        <Box display="flex" alignItems="center" mb={1}>
          <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
          <Typography variant="caption" color="text.secondary">
            {item.location}
          </Typography>
        </Box>

        {/* Informações do Proprietário */}
        {showOwner && item.owner && (
          <Box display="flex" alignItems="center" mt={1}>
            <Avatar
              src={item.owner.avatar}
              sx={{ width: 20, height: 20, mr: 0.5 }}
            >
              <PersonIcon fontSize="small" />
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {item.owner.name || item.owner}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Ações do Card */}
      <CardActions sx={{ px: 1.5, pb: 1.5, pt: 0 }}>
        <Button
          size="small"
          startIcon={<ViewIcon />}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          sx={{ fontSize: '0.75rem', minWidth: 'auto', px: 1 }}
        >
          Ver
        </Button>
        <Button
          size="small"
          color="secondary"
          startIcon={<SwapIcon />}
          onClick={handleMakeOfferClick}
          sx={{ 
            ml: 'auto', 
            fontSize: '0.75rem', 
            minWidth: 'auto', 
            px: 1 
          }}
        >
          Oferta
        </Button>
      </CardActions>

      {/* Indicador de Novo Item */}
      {item.isNew && (
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            left: -8,
            backgroundColor: 'error.main',
            color: 'white',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          N
        </Box>
      )}
    </Card>
  );
};

export default ItemCard;