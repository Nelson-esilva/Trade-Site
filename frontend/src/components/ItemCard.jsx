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
  Tooltip,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Visibility as ViewIcon,
  SwapHoriz as SwapIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const IMAGE_HEIGHT = 200;

const categoryLabels = {
  livros: 'Livros',
  apostilas: 'Apostilas',
  equipamentos: 'Equipamentos',
  tecnologia: 'Tecnologia',
};

const categoryIcons = {
  livros: '📚',
  apostilas: '📄',
  equipamentos: '🔧',
  tecnologia: '💻',
};

const statusMap = {
  disponivel: { label: 'Disponível', color: 'success' },
  'indisponível': { label: 'Indisponível', color: 'error' },
  trocado: { label: 'Trocado', color: 'info' },
};

const ItemCard = ({ item, onViewDetails, onMakeOffer }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const status = statusMap[item.status] || { label: item.status, color: 'default' };

  const handleCardClick = () => {
    if (onViewDetails) onViewDetails(item);
    else navigate(`/item/${item.id}`);
  };

  const handleOfferClick = (e) => {
    e.stopPropagation();
    if (onMakeOffer) onMakeOffer(item);
    else navigate(`/item/${item.id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.10)',
        },
      }}
    >
      {/* Image */}
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        {item.image ? (
          <CardMedia
            component="img"
            height={IMAGE_HEIGHT}
            image={item.image}
            alt={item.title}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              height: IMAGE_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#f1f5f9',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '2.5rem', lineHeight: 1 }}>
                {categoryIcons[item.category] || '📦'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {categoryLabels[item.category] || item.category}
              </Typography>
            </Box>
          </Box>
        )}

        <Chip
          label={categoryLabels[item.category] || item.category}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            bgcolor: 'rgba(15, 23, 42, 0.7)',
            color: '#fff',
            backdropFilter: 'blur(4px)',
            fontWeight: 600,
            fontSize: '0.68rem',
          }}
        />

        <Tooltip title="Favoritar">
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(4px)',
              width: 32,
              height: 32,
              '&:hover': { bgcolor: '#fff' },
            }}
          >
            {isFavorite ? (
              <FavoriteIcon sx={{ fontSize: 16 }} color="error" />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Content - fixed structure */}
      <CardContent sx={{ flexGrow: 1, p: 2, pb: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.35,
            minHeight: '2.7em',
            mb: 1,
          }}
        >
          {item.title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
          <Chip label={status.label} size="small" color={status.color} variant="outlined" />
          {item.condition && (
            <Chip label={item.condition} size="small" variant="outlined" />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
          <LocationIcon sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
          <Typography variant="caption" color="text.secondary" noWrap>
            {item.location || 'Local não informado'}
          </Typography>
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button
          size="small"
          startIcon={<ViewIcon sx={{ fontSize: 16 }} />}
          onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
          sx={{ color: 'text.secondary' }}
        >
          Detalhes
        </Button>
        <Button
          size="small"
          variant="contained"
          startIcon={<SwapIcon sx={{ fontSize: 16 }} />}
          onClick={handleOfferClick}
          sx={{ ml: 'auto' }}
        >
          Oferta
        </Button>
      </CardActions>
    </Card>
  );
};

export default ItemCard;
